import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ApiErrorData = {
  message?: string;
};

const getApiErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) {
    return 'Something went wrong!!';
  }
  const err = error as FetchBaseQueryError & {
    data?: ApiErrorData;
  };
  // Backend
  if (err.data?.message) {
    return err.data.message;
  }
  // Network error
  if (err.status === 'FETCH_ERROR') {
    return 'Please check your internet connection.';
  }
  // Timeout
  if (err.status === 'TIMEOUT_ERROR') {
    return 'Request timed out. Please try again.';
  }
  // Parsing error
  if (err.status === 'PARSING_ERROR') {
    return 'Something went wrong while processing the response.';
  }
  // Other error
  if ('message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return 'Something went wrong!!';
};

export default getApiErrorMessage;
