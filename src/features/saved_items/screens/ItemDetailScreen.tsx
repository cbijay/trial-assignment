import { SavedItemsStackParamList } from '@/app/navigation/SavedItemsStack';
import { ItemDetailError } from '@/features/home_items/components/ItemDetailError';
import { ItemDetailLoading } from '@/features/home_items/components/ItemDetailLoading';
import { useItemDetail } from '@/features/saved_items/hooks/useItemDetail';
import { generateShareableLink } from '@/features/saved_items/services/linkingService';
import { ItemActions } from '@/shared/components/ItemActions';
import { ScreenAnimation } from '@/shared/components/ScreenAnimation';
import { commonStyles } from '@/shared/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import {
  Alert,
  Animated,
  Share,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

type ItemDetailScreenRouteProp = import('@react-navigation/native').RouteProp<
  SavedItemsStackParamList,
  'ItemDetail'
>;

type ItemDetailScreenNavigationProp = NativeStackNavigationProp<
  SavedItemsStackParamList,
  'ItemDetail'
>;

export const ItemDetailScreen: React.FC = () => {
  const route = useRoute<ItemDetailScreenRouteProp>();
  const navigation = useNavigation<ItemDetailScreenNavigationProp>();
  const { itemId } = route.params;

  const { item, isLoading, error, toggleSave, isToggling } = useItemDetail(itemId);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const slideAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    });

    const animation = Animated.parallel([fadeAnimation, slideAnimation]);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim, slideAnim]);

  const handleShare = useCallback(async () => {
    if (!item) return;

    try {
      const shareableLink = generateShareableLink(item.id);
      await Share.share({
        message: `Check out this item: ${item.title}\n${shareableLink}`,
        title: item.title,
      });
    } catch (error) {
      console.error('Error sharing item:', error);
      Alert.alert('Error', 'Failed to share item');
    }
  }, [item]);

  const handleToggleSave = useCallback(async () => {
    if (!item) return;

    try {
      await toggleSave();

      const action = !item.isSaved ? 'saved' : 'removed';
      Alert.alert(
        'Success',
        `Item ${action} successfully!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error toggling save status:', error);
      Alert.alert(
        'Error',
        'Failed to update item status. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [item, toggleSave]);

  React.useLayoutEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.title,
        headerRight: () => (
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Icon name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, item, handleShare]);

  if (isLoading) {
    return <ItemDetailLoading fadeAnim={fadeAnim} slideAnim={slideAnim} />;
  }

  if (error || !item) {
    return (
      <ItemDetailError
        error={error instanceof Error ? error : new Error("Item not found")}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenAnimation>
        <View style={styles.infoContainer}>
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {item.title}
          </Animated.Text>

          <Animated.Text
            style={[
              styles.description,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {item.description}
          </Animated.Text>

          <ItemActions
            isSaved={item.isSaved}
            isToggling={isToggling}
            onSaveToggle={handleToggleSave}
            onShare={handleShare}
          />
        </View>
      </ScreenAnimation>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    ...commonStyles.title,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
