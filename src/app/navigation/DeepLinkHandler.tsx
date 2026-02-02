import { parseDeepLink } from '@/features/saved_items/services/linkingService';
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
    (url: string) => {
      if (!url) return;

      try {
        const parsed = parseDeepLink(url);
        if (parsed?.itemId) {
          navigation.navigate('SavedItemsTabStack', {
            screen: 'ItemDetail',
            params: { itemId: parsed.itemId },
          });
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
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
