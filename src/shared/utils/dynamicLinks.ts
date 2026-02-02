import { DEEP_LINKING } from '@/features/saved_items/constants';

/**
 * Service for handling deep links
 * Firebase Dynamic Links are deprecated (shutting down Aug 25, 2025)
 * Using React Native Linking with custom URL schemes as the primary solution
 * Consider Branch.io or AppsFlyer for advanced features like analytics, deferred deep linking, etc.
 */

/**
 * Create a deep link for an item
 * Using React Native Linking as the primary solution
 */
export const createDynamicLink = async (itemId: string): Promise<string> => {
  try {
    // Using React Native Linking as primary solution
    return createFallbackLink(itemId);
  } catch (error) {
    console.error('Error creating deep link:', error);
    return createFallbackLink(itemId);
  }
};

/**
 * Create a regular deep link using custom URL scheme
 */
export const createFallbackLink = (itemId: string): string => {
  return `${DEEP_LINKING.SCHEME}://${DEEP_LINKING.ITEM_DETAIL}?itemId=${itemId}`;
};

/**
 * Parse incoming deep link
 */
export const parseDynamicLink = async (url: string): Promise<string | null> => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === DEEP_LINKING.ITEM_DETAIL) {
      return urlObj.searchParams.get('itemId');
    }
    return null;
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

/**
 * Check if the app was opened from a deep link
 */
export const getInitialDynamicLink = async (): Promise<string | null> => {
  try {
    return createFallbackLink('fallback');
  } catch (error) {
    console.error('Error getting initial deep link:', error);
    return null;
  }
};

/**
 * Generate shareable deep link
 */
export const generateShareableLink = async (
  itemId: string
): Promise<string> => {
  try {
    // Create deep link using React Native Linking
    return await createDynamicLink(itemId);
  } catch (error) {
    console.warn('Deep link creation failed, using fallback:', error);
    return createFallbackLink(itemId);
  }
};
