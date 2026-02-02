import { Item } from '@/features/home_items/types';
import { itemService } from '@/features/saved_items/services/itemService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useItems = () => {
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: () => itemService.getAllItems(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const refreshItems = () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  };

  return {
    items,
    isLoading,
    error,
    refetch: refreshItems,
  };
};

export const useItem = (itemId: string) => {
  return useQuery<Item | null>({
    queryKey: ['item', itemId],
    queryFn: () => itemService.getItem(itemId),
    enabled: !!itemId,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
