// src/utils/apiUtils.js
export function handleApiError(res, error, statusCode = 500) {
  console.error(error);
  return res.status(statusCode).json({ error: error.message || 'An unexpected error occurred' });
}
