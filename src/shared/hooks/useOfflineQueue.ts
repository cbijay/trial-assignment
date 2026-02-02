import {
  CreateItemData,
  UpdateItemData,
  UserSaveInput,
} from '@/features/saved_items/types';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

interface QueuedOperation {
  id: string;
  type: 'save' | 'unsave' | 'create' | 'update' | 'delete';
  data:
    | { type: 'save'; payload: UserSaveInput }
    | { type: 'unsave'; payload: UserSaveInput }
    | { type: 'create'; payload: CreateItemData }
    | { type: 'update'; payload: { id: string; data: UpdateItemData } }
    | { type: 'delete'; payload: { id: string } };
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface UseOfflineQueueOptions {
  maxQueueSize?: number;
  maxRetries?: number;
  retryDelay?: number;
  storageKey?: string;
}

export const useOfflineQueue = (options: UseOfflineQueueOptions = {}) => {
  const {
    maxQueueSize = 100,
    maxRetries = 3,
    storageKey = 'offline_queue',
  } = options;

  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isConnected } = useNetworkStatus();
  const isOnline = isConnected === true;
  const processingRef = useRef(false);

  const loadQueue = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const parsedQueue = JSON.parse(stored);
        setQueue(parsedQueue);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }, [storageKey]);

  const saveQueue = useCallback(async () => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, [queue, storageKey]);

  const removeFromQueue = useCallback((operationId: string) => {
    setQueue(prev => prev.filter(op => op.id !== operationId));
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current || !isOnline) return;

    processingRef.current = true;
    setIsProcessing(true);

    try {
      const operationsToProcess = [...queue];

      for (const operation of operationsToProcess) {
        try {
          // Execute operation based on type
          await executeOperation(operation);

          // Remove successful operation from queue
          removeFromQueue(operation.id);

          // Small delay between operations
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to process operation ${operation.id}:`, error);

          // Update retry count
          setQueue(prev =>
            prev.map(op =>
              op.id === operation.id
                ? { ...op, retryCount: op.retryCount + 1 }
                : op
            )
          );
        }
      }
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [queue, isOnline, removeFromQueue]);

  // Load queue from storage on mount
  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Save queue to storage whenever it changes
  useEffect(() => {
    saveQueue();
  }, [queue, saveQueue]);

  // Process queue when coming online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !processingRef.current) {
      processQueue();
    }
  }, [isOnline, queue, processQueue]);

  const addToQueue = useCallback(
    (
      type: QueuedOperation['type'],
      data: QueuedOperation['data'],
      customMaxRetries?: number
    ) => {
      const operation: QueuedOperation = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: customMaxRetries || maxRetries,
      };

      setQueue(prev => {
        const newQueue = [...prev, operation];
        // Limit queue size
        if (newQueue.length > maxQueueSize) {
          return newQueue.slice(-maxQueueSize);
        }
        return newQueue;
      });

      return operation.id;
    },
    [maxQueueSize, maxRetries]
  );

  const executeOperation = async (
    operation: QueuedOperation
  ): Promise<void> => {
    // Import itemService dynamically to avoid circular dependency
    const { itemService } =
      await import('@/features/saved_items/services/itemService');

    // This would be implemented based on your specific operations
    switch (operation.type) {
      case 'save':
        if (operation.data.type === 'save') {
          await itemService.saveItem(
            operation.data.payload.userId,
            operation.data.payload.itemId
          );
        }
        break;
      case 'unsave':
        if (operation.data.type === 'unsave') {
          await itemService.unsaveItem(
            operation.data.payload.userId,
            operation.data.payload.itemId
          );
        }
        break;
      case 'create':
        if (operation.data.type === 'create') {
          await itemService.createItem(operation.data.payload);
        }
        break;
      case 'update':
        if (operation.data.type === 'update') {
          await itemService.updateItem(
            operation.data.payload.id,
            operation.data.payload.data
          );
        }
        break;
      case 'delete':
        if (operation.data.type === 'delete') {
          await itemService.deleteItem(operation.data.payload.id);
        }
        break;
      default:
        throw new Error(`Unknown operation type: ${operation.type}`);
    }
  };

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const getQueueStats = useCallback(() => {
    const byType = queue.reduce(
      (acc, op) => {
        acc[op.type] = (acc[op.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: queue.length,
      byType,
      isProcessing,
      oldestOperation:
        queue.length > 0 ? Math.min(...queue.map(op => op.timestamp)) : null,
    };
  }, [queue, isProcessing]);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processQueue,
    isProcessing,
    isOnline,
    stats: getQueueStats(),
  };
};
