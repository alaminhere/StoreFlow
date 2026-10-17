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
  if (err.data?.message) {
    return err.data.message;
  }
  if (err.status === 'FETCH_ERROR') {
    return 'Please check your internet connection.';
  }
  if (err.status === 'TIMEOUT_ERROR') {
    return 'Request timed out. Please try again.';
  }
  if (err.status === 'PARSING_ERROR') {
    return 'Something went wrong while processing the response.';
  }
  if ('message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return 'Something went wrong!!';
};

export default getApiErrorMessage;
