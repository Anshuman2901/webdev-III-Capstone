const AppError = require('../utils/appError');
const config = require('../config/env');

// 404 Route Handler
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Endpoint not found on this server: ${req.method} ${req.originalUrl}`, 404));
};

// Global Centralized Error Handling Middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    err = new AppError(`Validation error: ${messages.join('. ')}`, 400);
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    err = new AppError(`Duplicate entry for ${field}. Value already exists.`, 409);
  }

  // Handle CastError (invalid MongoDB ObjectId)
  if (err.name === 'CastError') {
    err = new AppError(`Invalid format for parameter: ${err.path} (${err.value})`, 400);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(config.env === 'development' && {
      stack: err.stack,
      errorDetails: err,
    }),
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
