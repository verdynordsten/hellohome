import { Response } from 'express';

interface ApiResponseOptions {
  success?: boolean;
  message?: string;
  data?: unknown;
  statusCode?: number;
}

/**
 * Standardized API response helper
 * @param res Express Response object
 * @param options Response options
 */
export const sendApiResponse = (res: Response, options: ApiResponseOptions) => {
  const {
    success = true,
    message = 'Operation successful',
    data = null,
    statusCode = 200
  } = options;

  const response = {
    success,
    message,
    data
  };

  return res.status(statusCode).json(response);
};

/**
 * Success response helper
 * @param res Express Response object
 * @param message Success message
 * @param data Response data
 * @param statusCode HTTP status code (default: 200)
 */
export const sendSuccessResponse = (
  res: Response,
  message: string = 'Operation successful',
  data: unknown = null,
  statusCode: number = 200
) => {
  return sendApiResponse(res, {
    success: true,
    message,
    data,
    statusCode
  });
};

/**
 * Error response helper
 * @param res Express Response object
 * @param message Error message
 * @param statusCode HTTP status code (default: 500)
 */
export const sendErrorResponse = (
  res: Response,
  message: string = 'Internal server error',
  statusCode: number = 500
) => {
  return sendApiResponse(res, {
    success: false,
    message,
    data: null,
    statusCode
  });
};

/**
 * Not found response helper
 * @param res Express Response object
 * @param message Not found message
 */
export const sendNotFoundResponse = (
  res: Response,
  message: string = 'Resource not found'
) => {
  return sendErrorResponse(res, message, 404);
};

/**
 * Bad request response helper
 * @param res Express Response object
 * @param message Bad request message
 */
export const sendBadRequestResponse = (
  res: Response,
  message: string = 'Bad request'
) => {
  return sendErrorResponse(res, message, 400);
};

/**
 * Unauthorized response helper
 * @param res Express Response object
 * @param message Unauthorized message
 */
export const sendUnauthorizedResponse = (
  res: Response,
  message: string = 'Unauthorized'
) => {
  return sendErrorResponse(res, message, 401);
};

/**
 * Created response helper
 * @param res Express Response object
 * @param message Created message
 * @param data Response data
 */
export const sendCreatedResponse = (
  res: Response,
  message: string = 'Resource created successfully',
  data: unknown = null
) => {
  return sendSuccessResponse(res, message, data, 201);
};

/**
 * No content response helper
 * @param res Express Response object
 * @param message No content message
 */
export const sendNoContentResponse = (
  res: Response,
  message: string = 'Operation successful'
) => {
  return sendSuccessResponse(res, message, null, 204);
};