import { Router, Response } from 'express';
import { db } from '../../config/database';
import { units } from '../../../src/db/schema';
import { eq, desc, ilike, or, count, and } from 'drizzle-orm';
import { mapDrizzleUnit } from '../../utils/mappers';
import { authenticateToken } from '../../middleware/auth';
import {
  sendSuccessResponse,
  sendBadRequestResponse,
  sendErrorResponse,
  sendNotFoundResponse,
  sendCreatedResponse,
  sendNoContentResponse
} from '../../utils/response';
import multer from 'multer';
import { uploadMultipleFilesToS3, deleteMultipleFilesFromS3 } from '../../utils/storage';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', async (req, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const offset = (page - 1) * limit;

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

    const countResult = await db
      .select({ count: count() })
      .from(units)
      .where(whereCondition);
    
    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

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

    const result = await db
      .select()
      .from(units)
      .where(whereCondition)
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : sortColumn)
      .limit(limit)
      .offset(offset);
    
    const mappedUnits = result.map(mapDrizzleUnit);
    
    sendSuccessResponse(res, 'Units fetched successfully', {
      units: mappedUnits,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    console.error('Failed to fetch units:', error);
    sendErrorResponse(res, 'Failed to fetch units');
  }
});

router.get('/all', async (_req, res: Response) => {
  try {
    const result = await db.select().from(units).orderBy(desc(units.createdAt));
    const mappedUnits = result.map(mapDrizzleUnit);
    sendSuccessResponse(res, 'All units fetched successfully', mappedUnits);
  } catch (error) {
    console.error('Failed to fetch all units:', error);
    sendErrorResponse(res, 'Failed to fetch all units');
  }
});

router.get('/location/:locationId', async (req, res: Response) => {
  try {
    const { locationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const offset = (page - 1) * limit;

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

    const countResult = await db
      .select({ count: count() })
      .from(units)
      .where(whereCondition);
    
    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

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

    const result = await db
      .select()
      .from(units)
      .where(whereCondition)
      .orderBy(sortOrder === 'desc' ? desc(sortColumn) : sortColumn)
      .limit(limit)
      .offset(offset);
    
    const mappedUnits = result.map(mapDrizzleUnit);
    
    sendSuccessResponse(res, 'Units by location fetched successfully', {
      units: mappedUnits,
      total,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    console.error('Failed to fetch units by location ID:', error);
    sendErrorResponse(res, 'Failed to fetch units');
  }
});

router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (result.length === 0) {
      return sendNotFoundResponse(res, 'Unit not found');
    }
    const mappedUnit = mapDrizzleUnit(result[0]);
    sendSuccessResponse(res, 'Unit fetched successfully', mappedUnit);
  } catch (error) {
    console.error('Failed to fetch unit by ID:', error);
    sendErrorResponse(res, 'Failed to fetch unit');
  }
});

router.get('/slug/:slug', async (req, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await db.select().from(units).where(eq(units.slug, slug)).limit(1);
    if (result.length === 0) {
      return sendNotFoundResponse(res, 'Unit not found');
    }
    const mappedUnit = mapDrizzleUnit(result[0]);
    sendSuccessResponse(res, 'Unit fetched successfully', mappedUnit);
  } catch (error) {
    console.error('Failed to fetch unit by slug:', error);
    sendErrorResponse(res, 'Failed to fetch unit');
  }
});

router.post('/', authenticateToken, upload.array('images', 10), async (req, res: Response) => {
  try {
    const unitData = req.body;
    const files = req.files as Express.Multer.File[];
    
    if (!unitData.location_id || !unitData.type) {
      return sendBadRequestResponse(res, 'Location ID and type are required');
    }
    
    let uploadedImageUrls: string[] = [];
    
    // Handle file uploads if any
    if (files && files.length > 0) {
      try {
        const fileData = files.map((file: Express.Multer.File) => ({
          buffer: file.buffer,
          originalName: file.originalname,
          contentType: file.mimetype,
        }));
        
        uploadedImageUrls = await uploadMultipleFilesToS3(fileData);
      } catch (_uploadError) {
        return sendErrorResponse(res, 'Failed to upload images to storage');
      }
    }
    
    // Parse existing images from form data if provided
    let existingImages: string[] = [];
    if (unitData.existing_images) {
      try {
        existingImages = JSON.parse(unitData.existing_images);
      } catch (_parseError) {
        // Ignore parsing errors
      }
    }
    
    // Combine uploaded images with existing images
    const allImages = [...existingImages, ...uploadedImageUrls];
    
    const result = await db.insert(units).values({
      locationId: unitData.location_id,
      type: unitData.type,
      name: unitData.name || null,
      unitName: unitData.unit_name || null,
      slug: unitData.slug || null,
      description: unitData.description || null,
      pricePerMonth: unitData.price_per_month ? unitData.price_per_month.toString() : null,
      pricePerNight: unitData.price_per_night ? unitData.price_per_night.toString() : null,
      // Handle boolean field specifically for FormData
      available: unitData.available !== undefined ?
        (typeof unitData.available === 'string' ? unitData.available === 'true' : unitData.available) : true,
      imageUrl: null, // Always null as requested
      images: allImages.length > 0 ? allImages : null,
      features: unitData.features ?
        (() => {
          // Check if features is already an array
          if (Array.isArray(unitData.features)) {
            return unitData.features;
          } else if (typeof unitData.features === 'string') {
            try {
              return JSON.parse(unitData.features);
            } catch (_e) {
              // If parsing fails, treat it as a comma-separated string
              return unitData.features.split(',').map((f: string) => f.trim());
            }
          }
          return null;
        })() : null,
      view: unitData.view || null,
      floor: unitData.floor || null,
      building: unitData.building || null,
      tower: unitData.tower || null,
      mapEmbedUrl: unitData.map_embed_url || null,
    }).returning();
    
    if (result.length === 0) {
      // If database insert failed, try to delete uploaded files
      if (uploadedImageUrls.length > 0) {
        await deleteMultipleFilesFromS3(uploadedImageUrls);
      }
      return sendErrorResponse(res, 'Failed to create unit');
    }
    
    const mappedUnit = mapDrizzleUnit(result[0]);
    sendCreatedResponse(res, 'Unit created successfully', mappedUnit);
  } catch (error) {
    console.error('Failed to create unit:', error);
    sendErrorResponse(res, 'Failed to create unit');
  }
});

// Create a separate endpoint for updating unit data without file upload
router.put('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    const unitData = req.body;
    const existingUnit = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (existingUnit.length === 0) {
      return sendNotFoundResponse(res, 'Unit not found');
    }
    
    // Handle image deletions if specified
    let imagesToDelete: string[] = [];
    if (unitData.images_to_delete) {
      try {
        imagesToDelete = JSON.parse(unitData.images_to_delete);
        await deleteMultipleFilesFromS3(imagesToDelete);
      } catch (_deleteError) {
        // Ignore deletion errors
      }
    }
    
    // Parse features if provided
    let parsedFeatures = existingUnit[0].features;
    if (unitData.features) {
      // Check if features is already an array
      if (Array.isArray(unitData.features)) {
        parsedFeatures = unitData.features;
      } else if (typeof unitData.features === 'string') {
        try {
          parsedFeatures = JSON.parse(unitData.features);
        } catch (_parseError) {
          // If parsing fails, treat it as a comma-separated string
          parsedFeatures = unitData.features.split(',').map((f: string) => f.trim());
        }
      }
    }
    
    // Create update object with only the fields that are provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    // Only include fields that are explicitly provided and not empty in the request
    if (unitData.location_id !== undefined && unitData.location_id !== "") updateData.locationId = unitData.location_id;
    if (unitData.type !== undefined && unitData.type !== "") updateData.type = unitData.type;
    if (unitData.name !== undefined && unitData.name !== "") updateData.name = unitData.name;
    if (unitData.unit_name !== undefined && unitData.unit_name !== "") updateData.unitName = unitData.unit_name;
    if (unitData.slug !== undefined && unitData.slug !== "") updateData.slug = unitData.slug;
    if (unitData.description !== undefined && unitData.description !== "") updateData.description = unitData.description;
    if (unitData.price_per_month !== undefined && unitData.price_per_month !== "") updateData.pricePerMonth = unitData.price_per_month.toString();
    if (unitData.price_per_night !== undefined && unitData.price_per_night !== "") updateData.pricePerNight = unitData.price_per_night.toString();
    // Handle boolean field specifically
    if (unitData.available !== undefined) {
      // Convert string to boolean if needed
      let availableValue = unitData.available;
      if (typeof availableValue === 'string') {
        availableValue = availableValue === 'true';
      }
      updateData.available = availableValue;
    }
    if (unitData.view !== undefined && unitData.view !== "") updateData.view = unitData.view;
    if (unitData.floor !== undefined && unitData.floor !== "") updateData.floor = unitData.floor;
    if (unitData.building !== undefined && unitData.building !== "") updateData.building = unitData.building;
    if (unitData.tower !== undefined && unitData.tower !== "") updateData.tower = unitData.tower;
    if (unitData.map_embed_url !== undefined && unitData.map_embed_url !== "") updateData.mapEmbedUrl = unitData.map_embed_url;
    if (unitData.features !== undefined) updateData.features = parsedFeatures;
    if (unitData.images !== undefined) updateData.images = unitData.images;
    
    const result = await db.update(units)
      .set(updateData)
      .where(eq(units.id, id))
      .returning();
    
    if (result.length === 0) {
      return sendErrorResponse(res, 'Failed to update unit');
    }
    
    const mappedUnit = mapDrizzleUnit(result[0]);
    sendSuccessResponse(res, 'Unit updated successfully', mappedUnit);
  } catch (error) {
    console.error('Failed to update unit:', error);
    sendErrorResponse(res, 'Failed to update unit');
  }
});

// Create a separate endpoint for updating unit with file upload
router.put('/:id/with-images', authenticateToken, upload.array('images', 10), async (req, res: Response) => {
  try {
    const { id } = req.params;
    const unitData = req.body;
    const files = req.files as Express.Multer.File[];
    
    const existingUnit = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (existingUnit.length === 0) {
      return sendNotFoundResponse(res, 'Unit not found');
    }
    
    let uploadedImageUrls: string[] = [];
    let imagesToDelete: string[] = [];
    
    // Handle file uploads if any
    if (files && files.length > 0) {
      try {
        const fileData = files.map((file: Express.Multer.File) => ({
          buffer: file.buffer,
          originalName: file.originalname,
          contentType: file.mimetype,
        }));
        
        uploadedImageUrls = await uploadMultipleFilesToS3(fileData);
      } catch (_uploadError) {
        return sendErrorResponse(res, 'Failed to upload images to storage');
      }
    }
    
    // Handle image deletions if specified
    if (unitData.images_to_delete) {
      try {
        imagesToDelete = JSON.parse(unitData.images_to_delete);
        await deleteMultipleFilesFromS3(imagesToDelete);
      } catch (_deleteError) {
        // Ignore deletion errors
      }
    }
    
    // Parse existing images from form data if provided
    let existingImages: string[] = [];
    if (unitData.existing_images) {
      try {
        existingImages = JSON.parse(unitData.existing_images);
      } catch (_parseError) {
        // If parsing fails, use the current unit's images
        existingImages = existingUnit[0].images || [];
      }
    } else {
      // If no existing_images provided, use the current unit's images
      existingImages = existingUnit[0].images || [];
    }
    
    // Filter out images that were marked for deletion
    const filteredExistingImages = existingImages.filter(img => !imagesToDelete.includes(img));
    
    // Combine filtered existing images with newly uploaded images
    const allImages = [...filteredExistingImages, ...uploadedImageUrls];
    
    // Parse features if provided
    let parsedFeatures = existingUnit[0].features;
    if (unitData.features) {
      // Check if features is already an array
      if (Array.isArray(unitData.features)) {
        parsedFeatures = unitData.features;
      } else if (typeof unitData.features === 'string') {
        try {
          parsedFeatures = JSON.parse(unitData.features);
        } catch (_parseError) {
          // If parsing fails, treat it as a comma-separated string
          parsedFeatures = unitData.features.split(',').map((f: string) => f.trim());
        }
      }
    }
    
    // Create update object with only the fields that are provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: new Date(),
      images: allImages.length > 0 ? allImages : null,
      imageUrl: null, // Always null as requested
    };
    
    // Only include fields that are explicitly provided and not empty in the request
    if (unitData.location_id !== undefined && unitData.location_id !== "") updateData.locationId = unitData.location_id;
    if (unitData.type !== undefined && unitData.type !== "") updateData.type = unitData.type;
    if (unitData.name !== undefined && unitData.name !== "") updateData.name = unitData.name;
    if (unitData.unit_name !== undefined && unitData.unit_name !== "") updateData.unitName = unitData.unit_name;
    if (unitData.slug !== undefined && unitData.slug !== "") updateData.slug = unitData.slug;
    if (unitData.description !== undefined && unitData.description !== "") updateData.description = unitData.description;
    if (unitData.price_per_month !== undefined && unitData.price_per_month !== "") updateData.pricePerMonth = unitData.price_per_month.toString();
    if (unitData.price_per_night !== undefined && unitData.price_per_night !== "") updateData.pricePerNight = unitData.price_per_night.toString();
    // Handle boolean field specifically for FormData
    if (unitData.available !== undefined) {
      // Convert string to boolean if needed
      let availableValue = unitData.available;
      if (typeof availableValue === 'string') {
        availableValue = availableValue === 'true';
      }
      updateData.available = availableValue;
    }
    if (unitData.view !== undefined && unitData.view !== "") updateData.view = unitData.view;
    if (unitData.floor !== undefined && unitData.floor !== "") updateData.floor = unitData.floor;
    if (unitData.building !== undefined && unitData.building !== "") updateData.building = unitData.building;
    if (unitData.tower !== undefined && unitData.tower !== "") updateData.tower = unitData.tower;
    if (unitData.map_embed_url !== undefined && unitData.map_embed_url !== "") updateData.mapEmbedUrl = unitData.map_embed_url;
    if (unitData.features !== undefined) updateData.features = parsedFeatures;
    // Check if any fields are actually being updated
    const _hasUpdates = Object.keys(updateData).length > 2; // More than just updatedAt and images/imageUrl
    
    const result = await db.update(units)
      .set(updateData)
      .where(eq(units.id, id))
      .returning();
    
    if (result.length === 0) {
      // If database update failed, try to delete newly uploaded files
      if (uploadedImageUrls.length > 0) {
        await deleteMultipleFilesFromS3(uploadedImageUrls);
      }
      return sendErrorResponse(res, 'Failed to update unit');
    }
    
    const mappedUnit = mapDrizzleUnit(result[0]);
    sendSuccessResponse(res, 'Unit updated successfully', mappedUnit);
  } catch (error) {
    console.error('Failed to update unit:', error);
    sendErrorResponse(res, 'Failed to update unit');
  }
});

router.delete('/:id', authenticateToken, async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingUnit = await db.select().from(units).where(eq(units.id, id)).limit(1);
    if (existingUnit.length === 0) {
      return sendNotFoundResponse(res, 'Unit not found');
    }
    
    const result = await db.delete(units).where(eq(units.id, id)).returning();
    
    if (result.length === 0) {
      return sendErrorResponse(res, 'Failed to delete unit');
    }
    
    sendNoContentResponse(res, 'Unit deleted successfully');
  } catch (error) {
    console.error('Failed to delete unit:', error);
    sendErrorResponse(res, 'Failed to delete unit');
  }
});

// Upload images only endpoint (for separate upload process)
router.post('/upload-only', authenticateToken, upload.array('images', 10), async (req, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return sendBadRequestResponse(res, 'No files provided');
    }
    
    let uploadedImageUrls: string[] = [];
    
    // Handle file uploads
    try {
      const fileData = files.map((file: Express.Multer.File) => ({
        buffer: file.buffer,
        originalName: file.originalname,
        contentType: file.mimetype,
      }));
      
      uploadedImageUrls = await uploadMultipleFilesToS3(fileData);
    } catch (_uploadError) {
      return sendErrorResponse(res, 'Failed to upload images to storage');
    }
    
    sendSuccessResponse(res, 'Images uploaded successfully', uploadedImageUrls);
  } catch (error) {
    console.error('Failed to upload images:', error);
    sendErrorResponse(res, 'Failed to upload images');
  }
});

export default router;