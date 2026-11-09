/**
 * Middleware to handle 404 (Route not found) errors
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handling Middleware
 * Standardizes error responses with status codes and friendly messages
 */
const errorHandler = (err, req, res, next) => {
  // If status code is 200, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
