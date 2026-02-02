import { itemService } from '@/features/saved_items/services/itemService';
import { validateAndNavigateToItem } from '@/features/saved_items/services/linkingService';
import { ErrorFactory } from '@/shared/utils/errorHandling';

// Mock dependencies
jest.mock('@/features/saved_items/services/itemService');
const mockItemService = itemService as jest.Mocked<typeof itemService>;

describe('validateAndNavigateToItem', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to item when valid item ID is provided', async () => {
    const itemId = 'valid-item-123';
    const mockItem = {
      id: itemId,
      title: 'Test Item',
      description: 'Test Description',
      updatedAt: Date.now(),
    };

    mockItemService.getItem.mockResolvedValue(mockItem as any);

    const result = await validateAndNavigateToItem(
      itemId,
      mockNavigation as any
    );

    expect(result).toEqual({ success: true });
    expect(mockItemService.getItem).toHaveBeenCalledWith(itemId);
  });

  it('should return error for invalid item ID', async () => {
    const invalidItemId = '';

    const result = await validateAndNavigateToItem(
      invalidItemId,
      mockNavigation as any
    );

    expect(result).toEqual({
      success: false,
      error: 'Invalid item ID format',
    });
    expect(mockItemService.getItem).not.toHaveBeenCalled();
  });

  it('should return error when item is not found', async () => {
    const itemId = 'non-existent-item';
    mockItemService.getItem.mockResolvedValue(null);

    const result = await validateAndNavigateToItem(
      itemId,
      mockNavigation as any
    );

    expect(result).toEqual({
      success: false,
      error: 'Item not found or has been deleted',
    });
    expect(mockItemService.getItem).toHaveBeenCalledWith(itemId);
  });

  it('should handle service errors gracefully', async () => {
    const itemId = 'error-item';
    const error = ErrorFactory.itemNotFound(itemId);
    mockItemService.getItem.mockRejectedValue(error);

    const result = await validateAndNavigateToItem(
      itemId,
      mockNavigation as any
    );

    expect(result).toEqual({
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    });
  });
});
