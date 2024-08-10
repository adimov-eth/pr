import { NextResponse } from 'next/server';

export function handleApiError(error, headers = {}, statusCode = 500) {
  console.error('API Error:', error);
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : error.message || 'An unexpected error occurred';
  return NextResponse.json({ error: message }, { status: statusCode, headers });
}