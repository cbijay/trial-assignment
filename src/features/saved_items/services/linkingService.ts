import { DEEP_LINKING } from '@/features/saved_items/constants';
import { safeParse } from '@/shared/utils/safeParse';
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

export const generateShareableLink = (itemId: string): string => {
  return createItemDeepLink(itemId);
};
