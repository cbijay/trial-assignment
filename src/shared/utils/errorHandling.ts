/**
 * Simplified error handling utilities
 * Integrates with existing codebase without major restructuring
 */

// Error codes for consistent error handling
export enum ErrorCode {
  // Network errors
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  NETWORK_SERVER_ERROR = 'NETWORK_SERVER_ERROR',

  // Authentication errors
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',

  // Firestore errors
  FIRESTORE_PERMISSION_DENIED = 'FIRESTORE_PERMISSION_DENIED',
  FIRESTORE_DOCUMENT_NOT_FOUND = 'FIRESTORE_DOCUMENT_NOT_FOUND',
  FIRESTORE_QUOTA_EXCEEDED = 'FIRESTORE_QUOTA_EXCEEDED',

  // Item-specific errors
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  ITEM_SAVE_FAILED = 'ITEM_SAVE_FAILED',
  ITEM_DELETE_FAILED = 'ITEM_DELETE_FAILED',

  // Deep linking errors
  DEEP_LINK_INVALID = 'DEEP_LINK_INVALID',
  DEEP_LINK_ITEM_NOT_FOUND = 'DEEP_LINK_ITEM_NOT_FOUND',

  // Validation errors
  VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',

  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  userMessage: string;
  originalError?: unknown;
  retryable: boolean;
}

// Error factory functions
export class ErrorFactory {
  static networkTimeout(): AppError {
    return {
      code: ErrorCode.NETWORK_TIMEOUT,
      message: 'Network request timed out',
      userMessage:
        'Connection timed out. Please check your internet connection and try again.',
      retryable: true,
    };
  }

  static networkOffline(): AppError {
    return {
      code: ErrorCode.NETWORK_OFFLINE,
      message: 'Device is offline',
      userMessage:
        'You appear to be offline. Please check your internet connection.',
      retryable: true,
    };
  }

  static authUnauthorized(): AppError {
    return {
      code: ErrorCode.AUTH_UNAUTHORIZED,
      message: 'User is not authorized',
      userMessage: 'Please sign in to continue.',
      retryable: false,
    };
  }

  static itemNotFound(itemId: string): AppError {
    return {
      code: ErrorCode.ITEM_NOT_FOUND,
      message: `Item with ID ${itemId} not found`,
      userMessage: 'The requested item could not be found.',
      retryable: false,
    };
  }

  static itemSaveFailed(itemId: string, originalError?: unknown): AppError {
    return {
      code: ErrorCode.ITEM_SAVE_FAILED,
      message: `Failed to save item: ${itemId}`,
      userMessage: 'Failed to save the item. Please try again.',
      originalError,
      retryable: true,
    };
  }

  static deepLinkInvalid(url: string): AppError {
    return {
      code: ErrorCode.DEEP_LINK_INVALID,
      message: `Invalid deep link: ${url}`,
      userMessage: 'The link you clicked is not valid.',
      retryable: false,
    };
  }

  static validationRequiredField(field: string): AppError {
    return {
      code: ErrorCode.VALIDATION_REQUIRED_FIELD,
      message: `Required field is missing: ${field}`,
      userMessage: `Please provide a valid ${field}.`,
      retryable: false,
    };
  }

  static fromFirestoreError(
    error: { code?: string; message?: string },
    operation: string
  ): AppError {
    const errorCode = this.mapFirestoreErrorCode(error?.code);
    const userMessage = this.getUserMessageForFirestoreError(error?.code);

    return {
      code: errorCode,
      message: `Firestore error during ${operation}: ${error?.message || 'Unknown error'}`,
      userMessage,
      originalError: error,
      retryable: this.isRetryableFirestoreError(error?.code),
    };
  }

  private static mapFirestoreErrorCode(firestoreCode?: string): ErrorCode {
    switch (firestoreCode) {
      case 'permission-denied':
        return ErrorCode.FIRESTORE_PERMISSION_DENIED;
      case 'not-found':
        return ErrorCode.FIRESTORE_DOCUMENT_NOT_FOUND;
      case 'resource-exhausted':
        return ErrorCode.FIRESTORE_QUOTA_EXCEEDED;
      case 'deadline-exceeded':
      case 'unavailable':
      case 'unknown':
        return ErrorCode.NETWORK_SERVER_ERROR;
      default:
        return ErrorCode.UNKNOWN_ERROR;
    }
  }

  private static getUserMessageForFirestoreError(
    firestoreCode?: string
  ): string {
    switch (firestoreCode) {
      case 'permission-denied':
        return "You don't have permission to access this data.";
      case 'not-found':
        return 'The requested data was not found.';
      case 'resource-exhausted':
        return 'Service temporarily unavailable. Please try again later.';
      case 'deadline-exceeded':
        return 'Request took too long. Please try again.';
      case 'unavailable':
        return 'Service is temporarily unavailable. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  private static isRetryableFirestoreError(firestoreCode?: string): boolean {
    const retryableCodes = [
      'deadline-exceeded',
      'unavailable',
      'unknown',
      'resource-exhausted',
    ];
    return retryableCodes.includes(firestoreCode || '');
  }
}

// Utility functions
export function isAppError(error: unknown): error is AppError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    'userMessage' in error
  );
}

export function getUserMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

// Retry logic
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: unknown) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryCondition: defaultRetryCondition,
};

function defaultRetryCondition(error: unknown): boolean {
  if (isAppError(error)) {
    return error.retryable;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const networkKeywords = ['network', 'timeout', 'connection', 'unavailable'];
    return networkKeywords.some(keyword => message.includes(keyword));
  }

  return false;
}

function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  let delay = options.baseDelay * Math.pow(options.backoffFactor, attempt - 1);
  delay = Math.min(delay, options.maxDelay);

  // Add jitter to prevent thundering herd
  const jitter = delay * 0.1 * Math.random();
  return Math.floor(delay + jitter);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    if (typeof setTimeout !== 'undefined') {
      setTimeout(resolve, ms);
    } else {
      // Fallback for test environments
      resolve();
    }
  });
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts, baseDelay, maxDelay, backoffFactor, retryCondition } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !retryCondition(error)) {
        break;
      }

      const delay = calculateDelay(attempt, {
        maxAttempts,
        baseDelay,
        maxDelay,
        backoffFactor,
        retryCondition: retryCondition || defaultRetryCondition,
      });

      await sleep(delay);
    }
  }

  throw lastError;
}

export const retryNetworkOperation = <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> =>
  withRetry(operation, {
    maxAttempts,
    baseDelay: 1000,
    backoffFactor: 2,
  });

export const retryFirestoreOperation = <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 2
): Promise<T> => {
  return withRetry(operation, {
    maxAttempts,
    baseDelay: 500,
    maxDelay: 5000,
    backoffFactor: 1.5,
  });
};
