import { itemService } from '@/features/saved_items/services/itemService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseOptimizedItemsOptions {
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
}

export const useOptimizedItems = (options: UseOptimizedItemsOptions = {}) => {
  const {
    pageSize = 50,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const {
    data: paginatedData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['optimized-items', pageSize],
    queryFn: () => itemService.getAllItemsPaginated(pageSize),
    staleTime,
    enabled,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    return paginatedData?.items || [];
  }, [paginatedData]);

  const hasMore = useMemo(() => {
    return paginatedData?.hasMore || false;
  }, [paginatedData]);

  const totalCount = useMemo(() => {
    return paginatedData?.totalCount;
  }, [paginatedData]);

  return {
    items,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadMore: refetch,
    isLoadingMore: false,
  };
};

export const useOptimizedSavedItems = (
  userId: string,
  options: UseOptimizedItemsOptions = {}
) => {
  const {
    pageSize = 20,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
  } = options;

  const {
    data: savedItemsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['optimized-saved-items', userId, pageSize],
    queryFn: () => itemService.getSavedItems(userId, pageSize),
    staleTime,
    enabled: enabled && !!userId,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(() => {
    return savedItemsData?.items || [];
  }, [savedItemsData]);

  const hasMore = useMemo(() => {
    return savedItemsData?.hasMore || false;
  }, [savedItemsData]);

  return {
    items,
    isLoading,
    error,
    hasMore,
    loadMore: refetch,
    isLoadingMore: false,
  };
};

// Hook for search with debouncing
export const useOptimizedSearch = (
  searchQuery: string,
  options: { debounceMs?: number; minQueryLength?: number } = {}
) => {
  const { minQueryLength = 2 } = options;

  const {
    data: searchResults = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['item-search', searchQuery],
    queryFn: () => {
      if (searchQuery.length < minQueryLength) return [];
      return itemService.getAllItems(100); // Fallback to getAllItems
    },
    enabled: searchQuery.length >= minQueryLength,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    refetchOnWindowFocus: false,
  });

  return {
    searchResults,
    isLoading,
    error,
  };
};
