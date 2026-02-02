import { useInfiniteScroll } from '@/shared/hooks/usePagination';
import { itemService } from '@/features/saved_items/services/itemService';
import { Item } from '@/features/saved_items/types';

export const usePaginatedItems = (limit = 20) => {
  return useInfiniteScroll<Item>(
    async (page, limitCount) => {
      // For now, use the simple pagination approach
      // In a real implementation, you'd use cursor-based pagination with startAfter
      const result = await itemService.getAllItemsPaginated(limitCount);
      return {
        items: result.items,
        hasMore: result.hasMore,
        totalCount: result.totalCount,
      };
    },
    { initialLimit: limit }
  );
};
