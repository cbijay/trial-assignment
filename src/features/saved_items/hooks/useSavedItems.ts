import { useAuth } from '@/features/auth/hooks/useAuth';
import { QUERIES } from '@/features/saved_items/constants';
import { itemService } from '@/features/saved_items/services/itemService';
import { useSavedItemsStore } from '@/features/saved_items/state/savedItemsStore';
import { Item, SavedItem } from '@/features/saved_items/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';

export const useSavedItems = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    items: storeItems,
    savedItemIds,
    setItems,
    setSavedItemIds,
    addItem,
    updateItem: updateStoreItem,
    removeItem,
    toggleSaveItem,
    setError,
    clearError,
  } = useSavedItemsStore();

  const {
    data: allItems = [],
    isLoading: isAllItemsLoading,
    error: allItemsError,
    refetch,
  } = useQuery({
    queryKey: [QUERIES.ALL_ITEMS],
    queryFn: () => itemService.getAllItems(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: savedIds = [],
    isLoading: isSavedIdsLoading,
    error: savedIdsError,
  } = useQuery({
    queryKey: [QUERIES.SAVED_ITEMS, user?.uid],
    queryFn: () => (user ? itemService.getUserSavedItemIds(user.uid) : []),
    enabled: !!user,
  });

  // Combine items with saved status
  const items: SavedItem[] = useMemo(() => {
    return storeItems.map(item => ({
      ...item,
      isSaved: savedItemIds.includes(item.id),
      createdAt: item.updatedAt, // Fallback if createdAt not in Item type
      userId: user?.uid || '',
    }));
  }, [storeItems, savedItemIds, user?.uid]);

  const toggleSaveMutation = useMutation({
    mutationFn: async ({
      itemId,
      isSaved,
    }: {
      itemId: string;
      isSaved: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');

      if (isSaved) {
        await itemService.saveItem(user.uid, itemId);
      } else {
        await itemService.unsaveItem(user.uid, itemId);
      }
      return { itemId, isSaved };
    },
    onSuccess: ({ itemId, isSaved }: { itemId: string; isSaved: boolean }) => {
      toggleSaveItem(itemId, isSaved);
      queryClient.invalidateQueries({
        queryKey: [QUERIES.SAVED_ITEMS, user?.uid],
      });
    },
    onError: error => {
      setError(
        error instanceof Error ? error.message : 'Failed to toggle save'
      );
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (data: Partial<Item>) => itemService.createItem(data),
    onSuccess: (newItem: Item) => {
      addItem(newItem);
      queryClient.invalidateQueries({ queryKey: [QUERIES.ALL_ITEMS] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: Partial<Item> }) =>
      itemService.updateItem(itemId, data),
    onSuccess: (
      _: void,
      { itemId, data }: { itemId: string; data: Partial<Item> }
    ) => {
      updateStoreItem(itemId, data);
      queryClient.invalidateQueries({ queryKey: [QUERIES.ALL_ITEMS] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => itemService.deleteItem(itemId),
    onSuccess: (_: void, itemId: string) => {
      removeItem(itemId);
      queryClient.invalidateQueries({ queryKey: [QUERIES.ALL_ITEMS] });
    },
  });

  React.useEffect(() => {
    if (allItems.length > 0) {
      setItems(allItems);
    }
  }, [allItems, setItems]);

  React.useEffect(() => {
    if (savedIds.length > 0) {
      setSavedItemIds(savedIds);
    }
  }, [savedIds, setSavedItemIds]);

  return {
    items,
    savedItems: items.filter(item => item.isSaved),
    isLoading: isAllItemsLoading || isSavedIdsLoading,
    error: allItemsError || savedIdsError,
    toggleSave: toggleSaveMutation.mutateAsync,
    createItem: createItemMutation.mutateAsync,
    updateItem: updateItemMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    isToggling: toggleSaveMutation.isPending,
    isCreating: createItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isDeleting: deleteItemMutation.isPending,
    clearError,
    refetchAllItems: refetch,
  };
};
