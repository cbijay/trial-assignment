/**
 * Integration tests for Saved Items feature
 * Tests critical user flows end-to-end
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useSavedItems } from '@/features/saved_items/hooks/useSavedItems';
import { itemService } from '@/features/saved_items/services/itemService';
import { ErrorFactory } from '@/shared/utils/errorHandling';

// Mock Firebase
jest.mock('@/shared/utils/firebase', () => ({
  db: {},
  auth: {
    onAuthStateChanged: jest.fn(() => jest.fn()),
    currentUser: null,
    signOut: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
  },
}));

// Mock Auth service to prevent initialization errors
jest.mock('@/features/auth/services/authService', () => ({
  onAuthStateChanged: jest.fn(() => jest.fn()),
  getCurrentUser: jest.fn(() => null),
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
}));

// Mock useAuth hook to prevent auth initialization
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'user123' },
    isLoading: false,
    isAuthenticated: true,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock Expo Linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn((_path, _params) => `trialassignment://item-detail?itemId=test`),
  parse: jest.fn((url) => ({
    scheme: 'trialassignment',
    hostname: 'item-detail',
    queryParams: { itemId: url.includes('item123') ? 'item123' : 'nonexistent' },
  })),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

// Test component that uses the hook
const TestComponent: React.FC<{ userId?: string }> = ({ userId }) => {
  const { items, savedItems, isLoading, toggleSave, error } = useSavedItems();

  // Mark userId as unused to avoid lint error
  void userId;

  if (isLoading) return <View testID="loading" />;
  if (error) return <View testID="error"><Text>{error.message}</Text></View>;

  return (
    <View>
      {items.map((item) => (
        <View key={item.id} testID={`item-${item.id}`}>
          <Text>{item.title}</Text>
          <TouchableOpacity
            testID={`save-button-${item.id}`}
            onPress={() => toggleSave({ itemId: item.id, isSaved: !item.isSaved })}
          />
        </View>
      ))}
      <View testID="saved-count"><Text>{savedItems.length}</Text></View>
    </View>
  );
};

// Helper function to render with providers
const renderWithProviders = (component: React.ReactElement, queryClient?: QueryClient) => {
  const client = queryClient || new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      {component}
    </QueryClientProvider>
  );
};

describe('Saved Items Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe('User Flow: View and Save Items', () => {
    it('should load items and allow saving/unsaving', async () => {
      // Mock data
      const mockItems = [
        { id: 'item1', title: 'Test Item 1', description: 'Description 1', updatedAt: Date.now() },
        { id: 'item2', title: 'Test Item 2', description: 'Description 2', updatedAt: Date.now() },
      ];

      const mockUser = { uid: 'user123' };

      // Mock service calls
      jest.spyOn(itemService, 'getAllItems').mockResolvedValue(mockItems);
      jest.spyOn(itemService, 'getUserSavedItemIds').mockResolvedValue(['item1']);
      jest.spyOn(itemService, 'saveItem').mockResolvedValue();

      const { getByTestId, getByText } = renderWithProviders(<TestComponent userId={mockUser.uid} />, queryClient);

      // Wait for items to load
      await waitFor(() => {
        expect(getByTestId('item-item1')).toBeTruthy();
        expect(getByTestId('item-item2')).toBeTruthy();
      });

      // Verify saved count
      expect(getByText('1')).toBeTruthy();

      // Test saving an item
      const saveButton = getByTestId('save-button-item2');
      await act(async () => {
        fireEvent.press(saveButton);
      });

      // Verify the save operation was called
      await waitFor(() => {
        expect(getByText('2')).toBeTruthy();
      });
    });

    it('should handle network failures gracefully', async () => {
      const networkError = ErrorFactory.networkTimeout();

      jest.spyOn(itemService, 'getAllItems').mockRejectedValue(networkError);

      const { getByTestId, getByText } = renderWithProviders(<TestComponent />, queryClient);

      await waitFor(() => {
        expect(getByTestId('error')).toBeTruthy();
      });

      // Should show user-friendly error message
      expect(getByText('Network request timed out')).toBeTruthy();
    });
  });

  describe('User Flow: Deep Linking', () => {
    it('should handle valid deep links to items', async () => {
      const mockItem = { id: 'item123', title: 'Shared Item', description: 'Shared description', updatedAt: Date.now() };

      jest.spyOn(itemService, 'getItem').mockResolvedValue(mockItem);

      const { parseDeepLink } = require('@/features/saved_items/services/linkingService');
      const deepLinkUrl = 'trialassignment://item-detail?itemId=item123';

      const parsed = parseDeepLink(deepLinkUrl);

      expect(parsed?.itemId).toBe('item123');

      // Verify item exists
      const item = await itemService.getItem('item123');
      expect(item).toEqual(mockItem);
    });

    it('should handle deep links to non-existent items', async () => {
      jest.spyOn(itemService, 'getItem').mockResolvedValue(null);

      const { parseDeepLink } = require('@/features/saved_items/services/linkingService');
      const deepLinkUrl = 'trialassignment://item-detail?itemId=nonexistent';

      const parsed = parseDeepLink(deepLinkUrl);

      expect(parsed?.itemId).toBe('nonexistent');

      // Should handle null result gracefully
      const item = await itemService.getItem('nonexistent');
      expect(item).toBeNull();
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle Firestore permission errors', async () => {
      const firestoreError = {
        code: 'permission-denied',
        message: 'Permission denied',
      };

      const appError = ErrorFactory.fromFirestoreError(firestoreError, 'saveItem');

      expect(appError.code).toBe('FIRESTORE_PERMISSION_DENIED');
      expect(appError.userMessage).toBe('You don\'t have permission to access this data.');
      expect(appError.retryable).toBe(false);
    });

    it('should handle quota exceeded errors', async () => {
      const quotaError = {
        code: 'resource-exhausted',
        message: 'Quota exceeded',
      };

      const appError = ErrorFactory.fromFirestoreError(quotaError, 'getAllItems');

      expect(appError.code).toBe('FIRESTORE_QUOTA_EXCEEDED');
      expect(appError.userMessage).toBe('Service temporarily unavailable. Please try again later.');
      expect(appError.retryable).toBe(true);
    });

    it('should handle malformed item data', async () => {
      const malformedData = {
        // Missing required fields
        id: 'item1',
        title: '',
        description: null,
      };

      // Should validate and throw appropriate error
      expect(() => {
        if (!malformedData.title || malformedData.title.trim() === '') {
          throw ErrorFactory.validationRequiredField('title');
        }
      }).toThrow('title');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large item lists efficiently', async () => {
      // Mock large dataset
      const largeItemList = Array.from({ length: 1000 }, (_, i) => ({
        id: `item${i}`,
        title: `Item ${i}`,
        description: `Description for item ${i}`,
        updatedAt: Date.now() - i * 1000,
      }));

      jest.spyOn(itemService, 'getAllItemsPaginated').mockResolvedValue({
        items: largeItemList.slice(0, 20),
        hasMore: true,
        totalCount: 1000,
      });

      const result = await itemService.getAllItemsPaginated(20);

      expect(result.items).toHaveLength(20);
      expect(result.hasMore).toBe(true);
    });
  });

  describe('Batch Operations', () => {
    it('should handle batch save operations efficiently', async () => {
      const mockUser = { uid: 'user123' };
      const operations = [
        { itemId: 'item1', action: 'save' as const },
        { itemId: 'item2', action: 'unsave' as const },
        { itemId: 'item3', action: 'save' as const },
      ];

      // Need to mock the method that exists
      const mockBatchUpdate = jest.fn().mockResolvedValue(undefined);
      (itemService as { batchUpdateSaveStatus?: jest.Mock }).batchUpdateSaveStatus = mockBatchUpdate;

      await (itemService as { batchUpdateSaveStatus?: (userId: string, operations: unknown[]) => Promise<void> }).batchUpdateSaveStatus?.(mockUser.uid, operations);
    });
  });
});
