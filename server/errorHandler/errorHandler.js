



export const errorHandler = (err, req, res, next) => {
    // Log the error with a timestamp
    console.error(`[${new Date().toISOString()}] Global Error Handler:`, err);
  
    // Determine the status code and error message based on the type of error
    let statusCode = 500; // Internal Server Error
    let errorMessage = 'Internal Server Error';
  
    // Handle specific types of errors with appropriate responses
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      // Handle JSON parsing error (e.g., invalid JSON in the request)
      statusCode = 400; // Bad Request
      errorMessage = 'Bad Request: Invalid JSON';
    } else if (err.name === 'ValidationError') {
      // Handle Mongoose validation errors (e.g., when saving to the database)
      statusCode = 400; // Bad Request
      errorMessage = err.message;
    } else if (err.name === 'UnauthorizedError') {
      // Handle JWT authentication errors
      statusCode = 401; // Unauthorized
      errorMessage = 'Unauthorized: Invalid Token';
    } else if (err.name === 'NotFound') {
      // Handle custom "Not Found" errors
      statusCode = 404; // Not Found
      errorMessage = err.message;
    } // Add more custom error handling as needed
  
    // Respond with the appropriate status code and error message
    res.status(statusCode).json({ error: errorMessage });
  };
  