import { HomeStackParamList } from '@/app/navigation/HomeStack';
import { ItemDetailContent } from '@/features/home_items/components/ItemDetailContent';
import { ItemDetailError } from '@/features/home_items/components/ItemDetailError';
import { ItemDetailLoading } from '@/features/home_items/components/ItemDetailLoading';
import { useItem } from '@/features/home_items/hooks/useItems';
import { useSavedItems } from '@/features/saved_items/hooks/useSavedItems';
import { generateShareableLink } from '@/features/saved_items/services/linkingService';
import { ScreenAnimation } from '@/shared/components/ScreenAnimation';
import { commonStyles } from '@/shared/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

type ItemDetailScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'ItemDetail'
>;

export const ItemDetailScreen: React.FC = () => {
  const navigation = useNavigation<ItemDetailScreenNavigationProp>();
  const route = useRoute();
  const { itemId } = route.params as { itemId: string };

  const { data: item, isLoading, error } = useItem(itemId);
  const { savedItems, toggleSave, isToggling } = useSavedItems();

  const isItemSaved = item ? savedItems.some(savedItem => savedItem.id === item.id) : false;

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

  const handleShare = React.useCallback(async () => {
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

  const handleToggleSave = React.useCallback(async () => {
    if (!item) return;

    try {
      await toggleSave({ itemId: item.id, isSaved: !isItemSaved });

      const action = !isItemSaved ? 'saved' : 'removed';
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
  }, [item, isItemSaved, toggleSave]);

  React.useLayoutEffect(() => {
    if (item) {
      navigation.setOptions({
        title: item.title,
        headerRight: () => (
          <TouchableOpacity onPress={handleShare} style={styles.headerShareButton}>
            <Icon name="share-outline" size={20} color="#6366f1" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, item, handleShare]);


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ItemDetailLoading fadeAnim={fadeAnim} slideAnim={slideAnim} />
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <ItemDetailError error={error || undefined} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ScreenAnimation>
          <ItemDetailContent
            item={item}
            isItemSaved={isItemSaved}
            isToggling={isToggling}
            onToggleSave={handleToggleSave}
            onShare={handleShare}
          />
        </ScreenAnimation>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerShareButton: {
    marginRight: 16,
    padding: 8,
  },
});

export default ItemDetailScreen;
