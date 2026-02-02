import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  subscribeToItem,
  subscribeToItems,
  subscribeToUserSavedItems,
} from '@/features/saved_items/services/itemService';
import { Item } from '@/features/saved_items/types';
import { useEffect, useRef, useState } from 'react';

export const useRealTimeItems = (limitCount = 50) => {
  const [items, setItems] = useState<Item[]>([]);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const itemsUnsubscribeRef = useRef<(() => void) | null>(null);
  const savedItemsUnsubscribeRef = useRef<(() => void) | null>(null);

  const refetch = useRef(() => {
    setIsLoading(true);
    setError(null);

    // Cleanup existing subscriptions
    if (itemsUnsubscribeRef.current) {
      itemsUnsubscribeRef.current();
    }
    if (savedItemsUnsubscribeRef.current) {
      savedItemsUnsubscribeRef.current();
    }

    // Re-subscribe to all items
    itemsUnsubscribeRef.current = subscribeToItems(newItems => {
      setItems(newItems);
      setIsLoading(false);
    }, limitCount);

    // Re-subscribe to user's saved items if authenticated
    if (user) {
      savedItemsUnsubscribeRef.current = subscribeToUserSavedItems(
        user.uid,
        newSavedItemIds => {
          setSavedItemIds(newSavedItemIds);
        }
      );
    }
  }).current;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Subscribe to all items
    itemsUnsubscribeRef.current = subscribeToItems(newItems => {
      setItems(newItems);
      setIsLoading(false);
    }, limitCount);

    // Subscribe to user's saved items if authenticated
    if (user) {
      savedItemsUnsubscribeRef.current = subscribeToUserSavedItems(
        user.uid,
        newSavedItemIds => {
          setSavedItemIds(newSavedItemIds);
        }
      );
    }

    // Cleanup subscriptions
    return () => {
      if (itemsUnsubscribeRef.current) {
        itemsUnsubscribeRef.current();
      }
      if (savedItemsUnsubscribeRef.current) {
        savedItemsUnsubscribeRef.current();
      }
    };
  }, [user, limitCount]);

  // Combine items with saved status
  const itemsWithSaveStatus = items.map(item => ({
    ...item,
    isSaved: savedItemIds.includes(item.id),
    userId: user?.uid || '',
  }));

  return {
    items: itemsWithSaveStatus,
    savedItems: itemsWithSaveStatus.filter(item => item.isSaved),
    savedItemIds,
    isLoading,
    error,
    refetch,
  };
};

export const useRealTimeItem = (itemId: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!itemId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    unsubscribeRef.current = subscribeToItem(itemId, (newItem: Item | null) => {
      setItem(newItem);
      setIsLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [itemId]);

  return {
    item,
    isLoading,
    error,
  };
};
