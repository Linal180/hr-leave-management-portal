const { STATUS_CODES } = require('../utils/constants');

// Generic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          errors: validationErrors
        });
      }

      return res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: err.errors
    });
  }

  if (err.name === 'CastError') {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  return res.status(STATUS_CODES.INTERNAL_ERROR).json({
    success: false,
    message: 'Internal server error'
  });
};

// Not found middleware
const notFound = (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = {
  validateRequest,
  errorHandler,
  notFound
};
