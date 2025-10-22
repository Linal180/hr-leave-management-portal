import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { STATUS_CODES } from '../utils/constants';

// Generic validation middleware
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationErrors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
        return;
      }

      res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: (err as any).errors
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format'
    });
    return;
  }

  res.status(STATUS_CODES.INTERNAL_ERROR).json({
    success: false,
    message: 'Internal server error'
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response): void => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: 'Route not found'
  });
};
