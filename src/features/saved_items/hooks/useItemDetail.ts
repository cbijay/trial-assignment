import { useAuth } from '@/features/auth/hooks/useAuth';
import { QUERIES } from '@/features/saved_items/constants';
import { itemService } from '@/features/saved_items/services/itemService';
import { useSavedItemsStore } from '@/features/saved_items/state/savedItemsStore';
import { SavedItem } from '@/features/saved_items/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useItemDetail = (itemId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { savedItemIds, toggleSaveItem, setError } = useSavedItemsStore();

  const {
    data: item,
    isLoading: isItemLoading,
    error: itemError,
  } = useQuery({
    queryKey: [QUERIES.ITEM_DETAIL, itemId],
    queryFn: () => itemService.getItem(itemId),
    staleTime: 1 * 60 * 1000,
  });

  const isSaved = useMemo(
    () => savedItemIds.includes(itemId),
    [savedItemIds, itemId]
  );

  const toggleSaveMutation = useMutation({
    mutationFn: async (newSavedStatus: boolean) => {
      if (!user) throw new Error('User not authenticated');
      if (newSavedStatus) {
        await itemService.saveItem(user.uid, itemId);
      } else {
        await itemService.unsaveItem(user.uid, itemId);
      }
      return newSavedStatus;
    },
    onSuccess: (newSavedStatus: boolean) => {
      toggleSaveItem(itemId, newSavedStatus);
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

  const savedItem: SavedItem | null = useMemo(() => {
    if (!item) return null;
    return {
      ...item,
      isSaved,
      userId: user?.uid || '',
      createdAt: item.updatedAt,
    };
  }, [item, isSaved, user?.uid]);

  return {
    item: savedItem,
    isLoading: isItemLoading,
    error: itemError,
    toggleSave: () => toggleSaveMutation.mutateAsync(!isSaved),
    isToggling: toggleSaveMutation.isPending,
  };
};
