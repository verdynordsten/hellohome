import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Load environment variables
config({ path: '.env.local' });

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || 'us-east-1',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
  },
  forcePathStyle: true, // Required for some S3-compatible services
});

const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'hellohome';
const ENDPOINT = process.env.STORAGE_ENDPOINT || process.env.STORAGE_ENDPOINT;

/**
 * Generate a unique filename for uploaded files using UUID
 * @param originalName Original filename
 * @returns Unique filename with extension
 */
export const generateUniqueFileName = (originalName: string): string => {
  const ext = originalName.split('.').pop() || '';
  const uniqueId = uuidv4();
  return `${uniqueId}.${ext}`;
};

/**
 * Resize image to 800x800 maintaining aspect ratio
 * @param imageBuffer Buffer of the original image
 * @returns Resized image buffer
 */
export const resizeImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  try {
    const resizedImage = await sharp(imageBuffer)
      .resize(800, 800, {
        fit: 'cover', // Cover the area, maintaining aspect ratio
        position: 'center', // Center the image
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();
    
    return resizedImage;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw new Error('Failed to resize image');
  }
};

/**
 * Upload a file to S3 storage with auto-resize for images
 * @param file Buffer or file data to upload
 * @param fileName Name of the file in S3
 * @param contentType MIME type of the file
 * @returns Public URL of the uploaded file
 */
export const uploadFileToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  try {
    let processedFile = file;
    let processedContentType = contentType;

    // Resize image if it's an image file
    if (contentType.startsWith('image/')) {
      try {
        processedFile = await resizeImage(file);
        processedContentType = 'image/jpeg'; // Convert to JPEG after resize
        // Update filename to have .jpg extension
        const nameWithoutExt = fileName.split('.').slice(0, -1).join('.');
        fileName = `${nameWithoutExt}.jpg`;
      } catch (resizeError) {
        console.error('Error resizing image, uploading original:', resizeError);
        // If resize fails, continue with original file
      }
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: processedFile,
      ContentType: processedContentType,
      ACL: 'public-read', // Make the file publicly accessible
    });

    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `${ENDPOINT}/${BUCKET_NAME}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to storage');
  }
};

/**
 * Upload multiple files to S3 storage with auto-resize for images
 * @param files Array of files with buffer, original name, and content type
 * @returns Array of public URLs of the uploaded files
 */
export const uploadMultipleFilesToS3 = async (
  files: Array<{
    buffer: Buffer;
    originalName: string;
    contentType: string;
  }>
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(async (file) => {
      const fileName = generateUniqueFileName(file.originalName);
      return uploadFileToS3(file.buffer, fileName, file.contentType);
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple files to S3:', error);
    throw new Error('Failed to upload files to storage');
  }
};

/**
 * Delete a file from S3 storage
 * @param fileName Name of the file to delete
 * @returns True if deletion was successful
 */
export const deleteFileFromS3 = async (fileName: string): Promise<boolean> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
};

/**
 * Extract the S3 key from a public URL
 * @param url Public URL of the file
 * @returns S3 key (filename) or null if not found
 */
export const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Expected format: /bucket-name/filename
    const parts = pathname.split('/');
    if (parts.length >= 3 && parts[1] === BUCKET_NAME) {
      return parts.slice(2).join('/');
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting S3 key from URL:', error);
    return null;
  }
};

/**
 * Delete multiple files from S3 storage
 * @param urls Array of public URLs to delete
 * @returns Array of boolean values indicating success for each file
 */
export const deleteMultipleFilesFromS3 = async (urls: string[]): Promise<boolean[]> => {
  try {
    const deletePromises = urls.map(async (url) => {
      const key = extractS3KeyFromUrl(url);
      if (!key) return false;
      return deleteFileFromS3(key);
    });

    return await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple files from S3:', error);
    return urls.map(() => false);
  }
};