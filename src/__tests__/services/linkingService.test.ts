import {
  createItemDeepLink,
  generateShareableLink,
  isValidItemId,
  parseDeepLink,
} from '@/features/saved_items/services/linkingService';
import * as Linking from 'expo-linking';

// Mock expo-linking
jest.mock('expo-linking');
const mockLinking = Linking as jest.Mocked<typeof Linking>;

describe('LinkingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createItemDeepLink', () => {
    it('should create a deep link with item ID', () => {
      const itemId = 'test-item-123';
      const expectedUrl = 'trialassignment://item-detail?itemId=test-item-123';

      mockLinking.createURL.mockReturnValue(expectedUrl);

      const result = createItemDeepLink(itemId);

      expect(mockLinking.createURL).toHaveBeenCalledWith('item-detail', {
        queryParams: { itemId },
      });
      expect(result).toBe(expectedUrl);
    });

    it('should handle empty item ID', () => {
      const itemId = '';
      const expectedUrl = 'trialassignment://item-detail?itemId=';

      mockLinking.createURL.mockReturnValue(expectedUrl);

      const result = createItemDeepLink(itemId);

      expect(result).toBe(expectedUrl);
    });
  });

  describe('parseDeepLink', () => {
    it('should parse valid deep link with hostname', () => {
      const url = 'trialassignment://item-detail?itemId=test-item-123';
      const parsedUrl = {
        scheme: 'trialassignment',
        hostname: 'item-detail',
        path: 'item-detail',
        queryParams: { itemId: 'test-item-123' },
      };

      mockLinking.parse.mockReturnValue(parsedUrl);

      const result = parseDeepLink(url);

      expect(mockLinking.parse).toHaveBeenCalledWith(url);
      expect(result).toEqual({ itemId: 'test-item-123' });
    });

    it('should parse valid deep link with path', () => {
      const url = 'trialassignment://item-detail?itemId=test-item-456';
      const parsedUrl = {
        scheme: 'trialassignment',
        hostname: null,
        path: 'item-detail',
        queryParams: { itemId: 'test-item-456' },
      };

      mockLinking.parse.mockReturnValue(parsedUrl);

      const result = parseDeepLink(url);

      expect(result).toEqual({ itemId: 'test-item-456' });
    });

    it('should return null for invalid path', () => {
      const url = 'trialassignment://invalid-path?itemId=test-item-123';
      const parsedUrl = {
        scheme: 'trialassignment',
        hostname: 'invalid-path',
        path: 'invalid-path',
        queryParams: { itemId: 'test-item-123' },
      };

      mockLinking.parse.mockReturnValue(parsedUrl);

      const result = parseDeepLink(url);

      expect(result).toBeNull();
    });

    it('should return null for malformed URL', () => {
      const url = 'invalid-url';

      const result = parseDeepLink(url);

      expect(result).toBeNull();
    });

    it('should handle missing query parameters', () => {
      const url = 'trialassignment://item-detail';
      const parsedUrl = {
        scheme: 'trialassignment',
        hostname: 'item-detail',
        path: 'item-detail',
        queryParams: {},
      };

      mockLinking.parse.mockReturnValue(parsedUrl);

      const result = parseDeepLink(url);

      expect(result).toEqual({});
    });

    it('should handle multiple query parameters', () => {
      const url =
        'trialassignment://item-detail?itemId=test-item-123&source=share';
      const parsedUrl = {
        scheme: 'trialassignment',
        hostname: 'item-detail',
        path: 'item-detail',
        queryParams: { itemId: 'test-item-123', source: 'share' },
      };

      mockLinking.parse.mockReturnValue(parsedUrl);

      const result = parseDeepLink(url);

      expect(result).toEqual({ itemId: 'test-item-123', source: 'share' });
    });
  });

  describe('isValidItemId', () => {
    it('should return true for valid item ID', () => {
      expect(isValidItemId('test-item-123')).toBe(true);
    });

    it('should return false for invalid item ID', () => {
      expect(isValidItemId('')).toBe(false);
      expect(isValidItemId(null as unknown as string)).toBe(false);
      expect(isValidItemId(undefined as unknown as string)).toBe(false);
      expect(isValidItemId(123 as unknown as string)).toBe(false);
    });
  });

  describe('generateShareableLink', () => {
    it('should generate shareable link for item', () => {
      const itemId = 'test-item-123';
      const expectedUrl = 'trialassignment://item-detail?itemId=test-item-123';

      mockLinking.createURL.mockReturnValue(expectedUrl);

      const result = generateShareableLink(itemId);

      expect(result).toBe(expectedUrl);
      expect(mockLinking.createURL).toHaveBeenCalledWith('item-detail', {
        queryParams: { itemId },
      });
    });
  });
});
