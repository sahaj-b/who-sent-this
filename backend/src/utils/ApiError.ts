class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors: Error[];

  constructor(
    statusCode: number,
    message: string = "Error message not specified",
    errors: Error[] = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
