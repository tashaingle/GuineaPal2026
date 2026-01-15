import { useCallback } from 'react';

type ErrorHandler = (error: Error) => void;

export const useErrorHandler = (handler?: ErrorHandler): (error: Error) => void => {
  return useCallback(
    (error: Error) => {
      // Log the error
      console.error('Error caught by useErrorHandler:', error);

      // Call the custom handler if provided
      if (handler) {
        handler(error);
      }

      // You can add additional error handling logic here
      // For example, showing a toast message or sending to an error reporting service
    },
    [handler]
  );
}; 