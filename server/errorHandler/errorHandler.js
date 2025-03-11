export const handleErrors = (err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] Error in ${req.method} ${req.path}: `,
    err
  );

  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    errorMessage = "Bad Request: Invalid JSON format";
  }
  // Handle Joi validation errors
  else if (err.isJoi) {
    statusCode = 400;
    errorMessage = `Validation Error: ${err.details
      .map((detail) => detail.message)
      .join(", ")}`;
  }
  // Handle JWT authentication errors
  else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    errorMessage = "Unauthorized: Invalid or missing token";
  }
  // Handle MongoDB ObjectId errors
  else if (err.name === "CastError") {
    statusCode = 400;
    errorMessage = `Bad Request: Invalid ${err.path} value '${err.value}'`;
  }
  // Handle MongoDB unique index errors
  else if (err.code === 11000) {
    statusCode = 400;
    const duplicateField = Object.keys(err.keyValue)[0];
    errorMessage = `Bad Request: ${duplicateField} already exists`;
  }
  // Handle MongoDB validation errors
  else if (err.name === "ValidationError") {
    statusCode = 400;
    errorMessage = `Validation Error: ${Object.values(err.errors)
      .map((error) => error.message)
      .join(", ")}`;
  }
  // Handle MongoDB not found errors
  else if (err.name === "DocumentNotFoundError") {
    statusCode = 404;
    errorMessage = `Not Found: Resource not found`;
  }
  // Handle generic errors
  else if (err.status) {
    statusCode = err.status;
    errorMessage = err.message;
  }

  res.status(statusCode).json({ error: errorMessage });
};
