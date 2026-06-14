import ApiError from '../utils/ApiError.js'

const errorHandler = (err, req, res, next) => {
  let error = err

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    error = new ApiError(400, 'Invalid ID format')
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    error = new ApiError(400, `${field} already exists`)
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((val) => val.message)
    error = new ApiError(400, messages.join(', '))
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token')
  }
  if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired')
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.errors?.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default errorHandler