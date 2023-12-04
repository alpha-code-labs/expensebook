

export const handleErrors = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.path}: `, err);

  let statusCode = 500;
  let errorMessage = 'Something went wrong';

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorMessage = 'Bad Request: Invalid JSON';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Unauthorized: Invalid Token';
  } else if (err.name === 'NotFound') {
    statusCode = 404;
    errorMessage = err.message;
  }

  res.status(statusCode).json({ error: errorMessage });
};
