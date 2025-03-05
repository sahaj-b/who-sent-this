import { ErrorRequestHandler } from "express";
import ApiError from "../utils/ApiError";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, [], error.stack);
  }

  const response = {
    success: false,
    status: error.statusCode,
    message: error.message,
    errors: error.errors.length > 0 ? error.errors : undefined,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
