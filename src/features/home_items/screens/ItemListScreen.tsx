import { HomeStackParamList } from '@/app/navigation/HomeStack';
import { useAuthStore } from '@/features/auth';
import { ItemCard } from '@/features/home_items/components/ItemCard';
import { useItems } from '@/features/home_items/hooks/useItems';
import { Item } from '@/features/home_items/types';
import { useSavedItems } from '@/features/saved_items/hooks/useSavedItems';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

type ItemListScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'ItemList'
>;

export const ItemListScreen: React.FC = () => {
  const navigation = useNavigation<ItemListScreenNavigationProp>();
  const { signOut } = useAuthStore();

  const { items, isLoading, error, refetch } = useItems();
  const { savedItems, toggleSave, isToggling } = useSavedItems();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

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

  const handleLogout = React.useCallback(async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert(
                'Error',
                'Failed to log out. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }, [signOut]);

  const handleToggleSave = React.useCallback(
    async (itemId: string, currentSavedStatus: boolean) => {
      try {
        await toggleSave({ itemId, isSaved: !currentSavedStatus });

        const action = !currentSavedStatus ? 'saved' : 'removed';
        Alert.alert(
          'Success',
          `Item ${action} successfully!`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Failed to toggle save status:', error);
        Alert.alert(
          'Error',
          'Failed to update item status. Please try again.',
          [{ text: 'OK' }]
        );
      }
    },
    [toggleSave]
  );
  const handleItemPress = React.useCallback(
    (item: Item) => {
      navigation.navigate('ItemDetail', { itemId: item.id });
    },
    [navigation]
  );

  const renderItem = React.useCallback(
    ({ item, index }: { item: Item; index: number }) => {
      const isSaved = savedItems.some(savedItem => savedItem.id === item.id);
      return (
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20 + index * 10],
                }),
              },
            ],
          }}
        >
          <ItemCard
            item={item}
            onPress={handleItemPress}
            onToggleSave={handleToggleSave}
            isSaved={isSaved}
            isToggling={isToggling}
          />
        </Animated.View>
      );
    },
    [handleItemPress, handleToggleSave, savedItems, isToggling, fadeAnim, slideAnim]
  );

  const renderLoadingItem = React.useCallback(
    ({ index }: { index: number }) => (
      <Animated.View
        style={[
          styles.loadingCard,
          {
            opacity: 0.6,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 20 + index * 10],
                }),
              },
            ],
          },
        ]}
      />
    ),
    [slideAnim]
  );

  const header = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Find amazing items</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Log out"
          accessibilityRole="button"
        >
          <Icon name="log-out-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        data={isLoading ? Array(5).fill(null) : items}
        keyExtractor={(item, index) => item?.id || `loading-${index}`}
        renderItem={isLoading ? renderLoadingItem : renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={10}
        removeClippedSubviews={true}
        refreshing={isLoading}
        onRefresh={() => refetch()}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Icon name="cube-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>
                {error ? 'Error Loading Items' : 'No items found'}
              </Text>
              <Text style={styles.emptySubtext}>
                {error?.message || 'Try adjusting your search or filters'}
              </Text>
              {error && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => refetch()}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  loadingCard: {
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
