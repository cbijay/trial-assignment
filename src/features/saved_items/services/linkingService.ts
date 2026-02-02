import { DEEP_LINKING } from '@/features/saved_items/constants';
import { itemService } from '@/features/saved_items/services/itemService';
import { ErrorFactory } from '@/shared/utils/errorHandling';
import { safeParse } from '@/shared/utils/safeParse';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

interface DeepLinkParams {
  itemId?: string;
  [key: string]: string | undefined;
}

export const createItemDeepLink = (itemId: string): string => {
  return Linking.createURL(DEEP_LINKING.ITEM_DETAIL, {
    queryParams: { itemId },
  });
};

export const parseDeepLink = (url: string): DeepLinkParams | null => {
  try {
    const parsed = Linking.parse(url);

    if (
      parsed.path === DEEP_LINKING.ITEM_DETAIL ||
      parsed.hostname === DEEP_LINKING.ITEM_DETAIL
    ) {
      const params = safeParse<DeepLinkParams>(parsed.queryParams);
      return params;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse deep link:', error);
    return null;
  }
};

export const isValidItemId = (itemId: string): boolean => {
  return typeof itemId === 'string' && itemId.length > 0;
};

export const validateAndNavigateToItem = async (
  itemId: string,
  navigation: NativeStackNavigationProp<
    Record<string, object | undefined>,
    string
  >
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Validate item ID format
    if (!isValidItemId(itemId)) {
      return {
        success: false,
        error: 'Invalid item ID format',
      };
    }

    // Check if item exists in Firestore
    const item = await itemService.getItem(itemId);
    if (!item) {
      return {
        success: false,
        error: 'Item not found or has been deleted',
      };
    }

    // Navigate to item detail screen
    navigation.navigate('SavedItemsTabStack', {
      screen: 'ItemDetail',
      params: { itemId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error validating deep link navigation:', error);
    return {
      success: false,
      error: ErrorFactory.fromFirestoreError(
        error as { code?: string; message?: string },
        'validateDeepLink'
      ).userMessage,
    };
  }
};

export const generateShareableLink = (itemId: string): string => {
  return createItemDeepLink(itemId);
};
