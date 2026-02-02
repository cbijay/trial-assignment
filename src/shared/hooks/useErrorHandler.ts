import React, { useCallback, useState } from 'react';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

interface UseErrorHandlerReturn extends ErrorState {
  setError: (error: Error | string | null) => void;
  clearError: () => void;
  handleError: (error: Error | string, context?: string) => void;
  retry: () => void;
}

export const useErrorHandler = (
  initialError?: Error | null
): UseErrorHandlerReturn => {
  const [state, setState] = useState<ErrorState>({
    error: initialError || null,
    isError: !!initialError,
  });

  const setError = useCallback((error: Error | string | null) => {
    if (!error) {
      setState({ error: null, isError: false });
      return;
    }

    const errorObj = typeof error === 'string' ? new Error(error) : error;
    setState({ error: errorObj, isError: true });
  }, []);

  const clearError = useCallback(() => {
    setState({ error: null, isError: false });
  }, []);

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Log error with context
    console.error(`Error${context ? ` in ${context}` : ''}:`, errorObj);

    // In production, you might send this to an error reporting service
    if (!__DEV__) {
      // Example: Sentry.captureException(errorObj, { tags: { context } });
    }

    setState({ error: errorObj, isError: true });
  }, []);

  const retry = useCallback(() => {
    setState({ error: null, isError: false });
  }, []);

  return {
    ...state,
    setError,
    clearError,
    handleError,
    retry,
  };
};

/**
 * Hook for handling async operations with error boundaries
 */
export const useErrorHandlerAsync = <T>(
  asyncFunction: () => Promise<T>,
  _dependencies: unknown[] = []
) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      console.error('Async operation failed:', errorObj);
      setState(prev => ({ ...prev, loading: false, error: errorObj }));
      throw errorObj;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

/**
 * Higher-order component for error handling
 */
export const withErrorHandler = <P extends object>(
  Component: React.ComponentType<P>,
  errorHandler?: (error: Error) => void
) => {
  const WrappedComponent = (props: P) => {
    const { handleError } = useErrorHandler();

    React.useEffect(() => {
      if (errorHandler) {
        const handleErrorWrapper = (error: Error) => {
          handleError(error, Component.displayName || Component.name);
          errorHandler(error);
        };

        // Set up error handling for the component
        (Component as { handleError?: (error: Error) => void }).handleError =
          handleErrorWrapper;
      }
    }, [handleError]);

    return React.createElement(Component, props as P);
  };

  WrappedComponent.displayName = `withErrorHandler(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
