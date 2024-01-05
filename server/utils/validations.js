/**
 * Validates input parameters.
 * @param {Object} params - The input parameters to be validated.
 * @throws {Error} If any of the input parameters is missing.
 */

export const validateInput = (params) => {
    const missingParams = Object.keys(params).filter((param) => !params[param]);
    if (missingParams.length > 0) {
      throw new Error(`Invalid input parameters. Missing: ${missingParams.join(', ')}.`);
    }
  };


  /**
 * Handles database errors and logs them.
 * @param {Error} error - The database error.
 */
export const handleDatabaseError = (error) => {
    console.error('Database error:', error.message);
    // Additional error handling logic can be added here, such as logging to external services.
  };