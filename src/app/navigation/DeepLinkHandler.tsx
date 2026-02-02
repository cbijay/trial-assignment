import { parseDeepLink, validateAndNavigateToItem } from '@/features/saved_items/services/linkingService';
import * as Linking from 'expo-linking';
import React, { useCallback, useEffect } from 'react';

interface NavigationProps {
  navigate: (screen: string, params?: unknown) => void;
}

interface DeepLinkHandlerProps {
  navigation: NavigationProps;
}

export const DeepLinkHandler: React.FC<DeepLinkHandlerProps> = ({ navigation }) => {
  const handleDeepLink = useCallback(
    async (url: string) => {
      if (!url) return;

      try {
        const parsed = parseDeepLink(url);
        if (parsed?.itemId) {
          // Validate item exists before navigation
          const result = await validateAndNavigateToItem(parsed.itemId, navigation);

          if (!result.success) {
            console.error('Deep link validation failed:', result.error);
            // Optionally show error to user or navigate to error screen
            navigation.navigate('SavedItemsTabStack', {
              screen: 'ItemDetail',
              params: {
                itemId: parsed.itemId,
                error: result.error
              },
            });
          }
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
        // Navigate to error screen or show user-friendly message
        navigation.navigate('SavedItemsTabStack', {
          screen: 'ItemDetail',
          params: {
            error: 'Invalid link format'
          },
        });
      }
    },
    [navigation]
  );

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [handleDeepLink]);

  return null;
};
