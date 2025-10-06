import { Router, Response } from 'express';
import { db } from '../config/database';
import { locations } from '../../src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { mapDrizzleLocation } from '../utils/mappers';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all locations
router.get('/', async (_req, res: Response) => {
  try {
    const result = await db.select().from(locations).orderBy(desc(locations.createdAt));
    const mappedLocations = result.map(mapDrizzleLocation);
    res.json(mappedLocations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get location by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const mappedLocation = mapDrizzleLocation(result[0]);
    res.json(mappedLocation);
  } catch (error) {
    console.error('Failed to fetch location by ID:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Get location by slug
router.get('/slug/:slug', async (req, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await db.select().from(locations).where(eq(locations.slug, slug)).limit(1);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const mappedLocation = mapDrizzleLocation(result[0]);
    res.json(mappedLocation);
  } catch (error) {
    console.error('Failed to fetch location by slug:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Create location
router.post('/', authenticateToken, async (req, res: Response) => {
  try {
    const locationData = req.body;
    
    // Validate required fields
    if (!locationData.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Insert the new location
    const result = await db.insert(locations).values({
      name: locationData.name,
      description: locationData.description || null,
      imageUrl: locationData.image_url || null,
      slug: locationData.slug || null,
    }).returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to create location' });
    }
    
    const mappedLocation = mapDrizzleLocation(result[0]);
    res.status(201).json(mappedLocation);
  } catch (error) {
    console.error('Failed to create location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
});

// Update location
router.put('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    const locationData = req.body;
    
    // Check if location exists
    const existingLocation = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (existingLocation.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Update the location
    const result = await db.update(locations)
      .set({
        name: locationData.name !== undefined ? locationData.name : existingLocation[0].name,
        description: locationData.description !== undefined ? locationData.description : existingLocation[0].description,
        imageUrl: locationData.image_url !== undefined ? locationData.image_url : existingLocation[0].imageUrl,
        slug: locationData.slug !== undefined ? locationData.slug : existingLocation[0].slug,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, id))
      .returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to update location' });
    }
    
    const mappedLocation = mapDrizzleLocation(result[0]);
    res.json(mappedLocation);
  } catch (error) {
    console.error('Failed to update location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Delete location
router.delete('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if location exists
    const existingLocation = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (existingLocation.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Delete the location
    const result = await db.delete(locations).where(eq(locations.id, id)).returning();
    
    if (result.length === 0) {
      return res.status(500).json({ error: 'Failed to delete location' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

export default router;