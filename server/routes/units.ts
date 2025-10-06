import { Router, Response } from 'express';
import { db } from '../config/database';
import { units } from '../../src/db/schema';
import { eq, desc, ilike, or, count, and } from 'drizzle-orm';
import { mapDrizzleUnit } from '../utils/mappers';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all units with pagination, search, and sorting
router.get('/', async (req, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const offset = (page - 1) * limit;

    // Build the query conditions
    let whereCondition = undefined;
    if (search) {
      whereCondition = or(
        ilike(units.name, `%${search}%`),
        ilike(units.unitName, `%${search}%`),
        ilike(units.type, `%${search}%`),
        ilike(units.description, `%${search}%`),
        ilike(units.building, `%${search}%`),
        ilike(units.tower, `%${search}%`),
        ilike(units.floor, `%${search}%`),
        ilike(units.view, `%${search}%`)
      );
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(units)
      .where(whereCondition);
    
    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Determine the sort column and order
    let sortColumn;
    switch (sortBy) {
      case 'name':
        sortColumn = units.name;
        break;
      case 'type':
        sortColumn = units.type;
        break;
      case 'unitName':
        sortColumn = units.unitName;
        break;
      case 'price_per_month':
        sortColumn = units.pricePerMonth;
        break;
      case 'price_per_night':
        sortColumn = units.pricePerNight;
        break;
      case 'available':
        sortColumn = units.available;
        break;
      case 'view':
        sortColumn = units.view;
        break;
      case 'building':
        sortColumn = units.building;
        break;
      case 'tower':
        sortColumn = units.tower;
        break;
      case 'floor':
        sortColumn = units.floor;
        break;
      case 'createdAt':
      default:
        sortColumn = units.createdAt;
        break;
    }

    // Get the paginated results with sorting
    const result = await db
      .select()
      .from(units)
      .where(whereCondition)
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : sortColumn)
      .limit(limit)
      .offset(offset);
    
    const mappedUnits = result.map(mapDrizzleUnit);
    
    res.json({
      units: mappedUnits,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    console.error('Failed to fetch units:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// Get all units (legacy endpoint for backward compatibility)
router.get('/all', async (_req, res: Response) => {
  try {
    const result = await db.select().from(units).orderBy(desc(units.createdAt));
    const mappedUnits = result.map(mapDrizzleUnit);
    res.json(mappedUnits);
  } catch (error) {
    console.error('Failed to fetch all units:', error);
    res.status(500).json({ error: 'Failed to fetch all units' });
  }
});

// Get units by location ID
router.get('/location/:locationId', async (req, res: Response) => {
  try {
    const { locationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const offset = (page - 1) * limit;

    // Build the query conditions
    let whereCondition;
    if (search) {
      whereCondition = and(
        eq(units.locationId, locationId),
        or(
          ilike(units.name, `%${search}%`),
          ilike(units.unitName, `%${search}%`),
          ilike(units.type, `%${search}%`),
          ilike(units.description, `%${search}%`),
          ilike(units.building, `%${search}%`),
          ilike(units.tower, `%${search}%`),
          ilike(units.floor, `%${search}%`),
          ilike(units.view, `%${search}%`)
        )
      );
    } else {
      whereCondition = eq(units.locationId, locationId);
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(units)
      .where(whereCondition);
    
    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Determine the sort column and order
    let sortColumn;
    switch (sortBy) {
      case 'name':
        sortColumn = units.name;
        break;
      case 'type':
        sortColumn = units.type;
        break;
      case 'unitName':
        sortColumn = units.unitName;
        break;
      case 'price_per_month':
        sortColumn = units.pricePerMonth;
        break;
      case 'price_per_night':
        sortColumn = units.pricePerNight;
        break;
      case 'available':
        sortColumn = units.available;
        break;
      case 'view':
        sortColumn = units.view;
        break;
      case 'building':
        sortColumn = units.building;
        break;
      case 'tower':
        sortColumn = units.tower;
        break;
      case 'floor':
        sortColumn = units.floor;
        break;
      case 'createdAt':
      default:
        sortColumn = units.createdAt;
        break;
    }

    // Get the paginated results with sorting
    const result = await db
      .select()
      .from(units)
      .where(whereCondition)
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : sortColumn)
      .limit(limit)
      .offset(offset);
    
    const mappedUnits = result.map(mapDrizzleUnit);
    
    res.json({
      units: mappedUnits,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    console.error('Failed to fetch units by location ID:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// Get unit by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    const mappedUnit = mapDrizzleUnit(result[0]);
    res.json(mappedUnit);
  } catch (error) {
    console.error('Failed to fetch unit by ID:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

// Get unit by slug
router.get('/slug/:slug', async (req, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await db.select().from(units).where(eq(units.slug, slug)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    const mappedUnit = mapDrizzleUnit(result[0]);
    res.json(mappedUnit);
  } catch (error) {
    console.error('Failed to fetch unit by slug:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

// Create unit
router.post('/', authenticateToken, async (req, res: Response) => {
  try {
    const unitData = req.body;
    
    // Validate required fields
    if (!unitData.location_id || !unitData.type) {
      return res.status(400).json({ error: 'Location ID and type are required' });
    }
    
    // Insert the new unit
    const result = await db.insert(units).values({
      locationId: unitData.location_id,
      type: unitData.type,
      name: unitData.name || null,
      unitName: unitData.unit_name || null,
      slug: unitData.slug || null,
      description: unitData.description || null,
      pricePerMonth: unitData.price_per_month ? unitData.price_per_month.toString() : null,
      pricePerNight: unitData.price_per_night ? unitData.price_per_night.toString() : null,
      available: unitData.available !== undefined ? unitData.available : true,
      imageUrl: unitData.image_url || null,
      images: unitData.images || null,
      features: unitData.features || null,
      view: unitData.view || null,
      floor: unitData.floor || null,
      building: unitData.building || null,
      tower: unitData.tower || null,
      mapEmbedUrl: unitData.map_embed_url || null,
    }).returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to create unit' });
    }
    
    const mappedUnit = mapDrizzleUnit(result[0]);
    res.status(201).json(mappedUnit);
  } catch (error) {
    console.error('Failed to create unit:', error);
    res.status(500).json({ error: 'Failed to create unit' });
  }
});

// Update unit
router.put('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    const unitData = req.body;
    
    // Check if unit exists
    const existingUnit = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (existingUnit.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    
    // Update the unit
    const result = await db.update(units)
      .set({
        locationId: unitData.location_id !== undefined ? unitData.location_id : existingUnit[0].locationId,
        type: unitData.type !== undefined ? unitData.type : existingUnit[0].type,
        name: unitData.name !== undefined ? unitData.name : existingUnit[0].name,
        unitName: unitData.unit_name !== undefined ? unitData.unit_name : existingUnit[0].unitName,
        slug: unitData.slug !== undefined ? unitData.slug : existingUnit[0].slug,
        description: unitData.description !== undefined ? unitData.description : existingUnit[0].description,
        pricePerMonth: unitData.price_per_month !== undefined ? unitData.price_per_month.toString() : existingUnit[0].pricePerMonth,
        pricePerNight: unitData.price_per_night !== undefined ? unitData.price_per_night.toString() : existingUnit[0].pricePerNight,
        available: unitData.available !== undefined ? unitData.available : existingUnit[0].available,
        imageUrl: unitData.image_url !== undefined ? unitData.image_url : existingUnit[0].imageUrl,
        images: unitData.images !== undefined ? unitData.images : existingUnit[0].images,
        features: unitData.features !== undefined ? unitData.features : existingUnit[0].features,
        view: unitData.view !== undefined ? unitData.view : existingUnit[0].view,
        floor: unitData.floor !== undefined ? unitData.floor : existingUnit[0].floor,
        building: unitData.building !== undefined ? unitData.building : existingUnit[0].building,
        tower: unitData.tower !== undefined ? unitData.tower : existingUnit[0].tower,
        mapEmbedUrl: unitData.map_embed_url !== undefined ? unitData.map_embed_url : existingUnit[0].mapEmbedUrl,
        updatedAt: new Date(),
      })
      .where(eq(units.id, id))
      .returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to update unit' });
    }
    
    const mappedUnit = mapDrizzleUnit(result[0]);
    res.json(mappedUnit);
  } catch (error) {
    console.error('Failed to update unit:', error);
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

// Delete unit
router.delete('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if unit exists
    const existingUnit = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (existingUnit.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    
    // Delete the unit
    const result = await db.delete(units).where(eq(units.id, id)).returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to delete unit' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete unit:', error);
    res.status(500).json({ error: 'Failed to delete unit' });
  }
});

export default router;