import { Router, Response } from 'express';
import { db } from '../../config/database';
import { locations } from '../../../src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { mapDrizzleLocation } from '../../utils/mappers';
import { authenticateToken } from '../../middleware/auth';
import {
  sendSuccessResponse,
  sendBadRequestResponse,
  sendErrorResponse,
  sendNotFoundResponse,
  sendCreatedResponse,
  sendNoContentResponse
} from '../../utils/response';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const result = await db.select().from(locations).orderBy(desc(locations.createdAt));
    const mappedLocations = result.map(mapDrizzleLocation);
    sendSuccessResponse(res, 'Locations fetched successfully', mappedLocations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    sendErrorResponse(res, 'Failed to fetch locations');
  }
});

router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (result.length === 0) {
      return sendNotFoundResponse(res, 'Location not found');
    }
    const mappedLocation = mapDrizzleLocation(result[0]);
    sendSuccessResponse(res, 'Location fetched successfully', mappedLocation);
  } catch (error) {
    console.error('Failed to fetch location by ID:', error);
    sendErrorResponse(res, 'Failed to fetch location');
  }
});

router.get('/slug/:slug', async (req, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await db.select().from(locations).where(eq(locations.slug, slug)).limit(1);
    if (result.length === 0) {
      return sendNotFoundResponse(res, 'Location not found');
    }
    const mappedLocation = mapDrizzleLocation(result[0]);
    sendSuccessResponse(res, 'Location fetched successfully', mappedLocation);
  } catch (error) {
    console.error('Failed to fetch location by slug:', error);
    sendErrorResponse(res, 'Failed to fetch location');
  }
});

router.post('/', authenticateToken, async (req, res: Response) => {
  try {
    const locationData = req.body;
    
    if (!locationData.name) {
      return sendBadRequestResponse(res, 'Name is required');
    }
    
    const result = await db.insert(locations).values({
      name: locationData.name,
      description: locationData.description || null,
      imageUrl: locationData.image_url || null,
      slug: locationData.slug || null,
    }).returning();
    
    if (result.length === 0) {
      return sendErrorResponse(res, 'Failed to create location');
    }
    
    const mappedLocation = mapDrizzleLocation(result[0]);
    sendCreatedResponse(res, 'Location created successfully', mappedLocation);
  } catch (error) {
    console.error('Failed to create location:', error);
    sendErrorResponse(res, 'Failed to create location');
  }
});

router.put('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    const locationData = req.body;
    
    const existingLocation = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (existingLocation.length === 0) {
      return sendNotFoundResponse(res, 'Location not found');
    }
    
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
      return sendErrorResponse(res, 'Failed to update location');
    }
    
    const mappedLocation = mapDrizzleLocation(result[0]);
    sendSuccessResponse(res, 'Location updated successfully', mappedLocation);
  } catch (error) {
    console.error('Failed to update location:', error);
    sendErrorResponse(res, 'Failed to update location');
  }
});

router.delete('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingLocation = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (existingLocation.length === 0) {
      return sendNotFoundResponse(res, 'Location not found');
    }
    
    const result = await db.delete(locations).where(eq(locations.id, id)).returning();
    
    if (result.length === 0) {
      return sendErrorResponse(res, 'Failed to delete location');
    }
    
    sendNoContentResponse(res, 'Location deleted successfully');
  } catch (error) {
    console.error('Failed to delete location:', error);
    sendErrorResponse(res, 'Failed to delete location');
  }
});

export default router;