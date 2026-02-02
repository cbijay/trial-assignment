import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import {
  AppError,
  ErrorCode,
  ErrorFactory,
  isAppError,
} from '@/shared/utils/errorHandling';
import { useCallback, useState } from 'react';

interface ErrorState {
  error: AppError | null;
  hasError: boolean;
  errorCount: number;
  lastErrorTime: number;
}

interface UseErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  enableRetry?: boolean;
  onError?: (error: AppError) => void;
  onRecovery?: () => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    enableRetry = true,
    onError,
    onRecovery,
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    errorCount: 0,
    lastErrorTime: 0,
  });

  const { isConnected } = useNetworkStatus();
  const isOnline = isConnected === true;

  const handleError = useCallback(
    (error: unknown): AppError => {
      let appError: AppError;

      if (isAppError(error)) {
        appError = error;
      } else if (error instanceof Error) {
        appError = {
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.message,
          userMessage: error.message,
          originalError: error,
          retryable: false,
        };
      } else {
        appError = ErrorFactory.networkTimeout(); // Default error
      }

      setErrorState(prev => ({
        error: appError,
        hasError: true,
        errorCount: prev.errorCount + 1,
        lastErrorTime: Date.now(),
      }));

      onError?.(appError);
      return appError;
    },
    [onError]
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      errorCount: 0,
      lastErrorTime: 0,
    });
    onRecovery?.();
  }, [onRecovery]);

  const canRetry = useCallback(
    (error?: AppError) => {
      const currentError = error || errorState.error;
      if (!currentError) return false;

      return (
        enableRetry &&
        currentError.retryable &&
        errorState.errorCount < maxRetries &&
        isOnline
      );
    },
    [enableRetry, errorState.error, errorState.errorCount, maxRetries, isOnline]
  );

  const executeWithErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      customErrorHandler?: (error: unknown) => AppError
    ): Promise<T> => {
      try {
        const result = await operation();

        // Clear error on successful operation
        if (errorState.hasError) {
          clearError();
        }

        return result;
      } catch (error) {
        const appError = customErrorHandler
          ? customErrorHandler(error)
          : handleError(error);

        // Auto-retry if possible
        if (canRetry(appError)) {
          setTimeout(
            () => {
              // Retry logic would be implemented by the caller
            },
            retryDelay * Math.pow(2, errorState.errorCount)
          );
        }

        throw appError;
      }
    },
    [
      handleError,
      clearError,
      canRetry,
      retryDelay,
      errorState.errorCount,
      errorState.hasError,
    ]
  );

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    errorCount: errorState.errorCount,
    lastErrorTime: errorState.lastErrorTime,
    handleError,
    clearError,
    canRetry,
    executeWithErrorHandling,
    isOnline,
  };
};

// Specialized error handlers for different scenarios
export const useItemErrorHandler = () => {
  const errorHandler = useErrorHandler({
    maxRetries: 2,
    retryDelay: 500,
    onError: error => {
      console.error('Item operation failed:', error);
    },
  });

  const handleItemError = useCallback(
    (error: unknown, _operation: string) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return ErrorFactory.itemNotFound('unknown');
      }

      return errorHandler.handleError(error);
    },
    [errorHandler]
  );

  return {
    ...errorHandler,
    handleItemError,
  };
};

export const useDeepLinkErrorHandler = () => {
  const errorHandler = useErrorHandler({
    maxRetries: 1,
    enableRetry: false, // Don't retry deep link errors
    onError: error => {
      console.error('Deep link error:', error);
    },
  });

  const handleDeepLinkError = useCallback(
    (error: unknown, url?: string) => {
      if (error instanceof Error && error.message.includes('not found')) {
        return ErrorFactory.deepLinkInvalid(url || 'unknown');
      }

      return errorHandler.handleError(error);
    },
    [errorHandler]
  );

  return {
    ...errorHandler,
    handleDeepLinkError,
  };
};

export const useNetworkErrorHandler = () => {
  const errorHandler = useErrorHandler({
    maxRetries: 5,
    retryDelay: 2000,
    onError: error => {
      console.error('Network operation failed:', error);
    },
  });

  return {
    ...errorHandler,
  };
};
