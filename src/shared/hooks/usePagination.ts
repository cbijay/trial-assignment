import { useCallback, useState } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  hasMore: boolean;
  isLoading: boolean;
  totalCount: number | null;
}

interface UsePaginationOptions {
  initialLimit?: number;
  totalItems?: number;
}

export type UsePaginationReturn = PaginationState & {
  nextPage: () => void;
  resetPagination: () => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setTotalCount: (count: number) => void;
  getCurrentOffset: () => number;
  canLoadMore: boolean;
};

export const usePagination = ({
  initialLimit = 20,
  totalItems,
}: UsePaginationOptions = {}): UsePaginationReturn => {
  const [state, setState] = useState<PaginationState>({
    page: 0,
    limit: initialLimit,
    hasMore: true,
    isLoading: false,
    totalCount: totalItems || null,
  });

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setState(prev => ({
      ...prev,
      page: 0,
      hasMore: true,
      isLoading: false,
    }));
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    setState(prev => ({ ...prev, hasMore }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setTotalCount = useCallback((totalCount: number) => {
    setState(prev => ({ ...prev, totalCount }));
  }, []);

  const getCurrentOffset = useCallback(() => {
    return state.page * state.limit;
  }, [state.page, state.limit]);

  const canLoadMore = state.hasMore && !state.isLoading;

  return {
    ...state,
    nextPage,
    resetPagination,
    setHasMore,
    setLoading,
    setTotalCount,
    getCurrentOffset,
    canLoadMore,
  };
};

/**
 * Hook for infinite scroll pagination
 */
export const useInfiniteScroll = <T>(
  fetchFunction: (
    page: number,
    limit: number
  ) => Promise<{ items: T[]; hasMore: boolean; totalCount?: number }>,
  options: UsePaginationOptions = {}
) => {
  const [items, setItems] = useState<T[]>([]);
  const pagination = usePagination(options);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (!pagination.canLoadMore) return;

    pagination.setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(pagination.page, pagination.limit);

      if (pagination.page === 0) {
        // First load - replace all items
        setItems(result.items);
      } else {
        // Subsequent loads - append items
        setItems(prev => [...prev, ...result.items]);
      }

      pagination.setHasMore(result.hasMore);
      if (result.totalCount !== undefined) {
        pagination.setTotalCount(result.totalCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
      console.error('Pagination error:', err);
    } finally {
      pagination.setLoading(false);
    }
  }, [pagination, fetchFunction]);

  const refresh = useCallback(async () => {
    pagination.resetPagination();
    await loadMore();
  }, [pagination, loadMore]);

  return {
    items,
    loadMore,
    refresh,
    error,
    pagination,
  };
};
