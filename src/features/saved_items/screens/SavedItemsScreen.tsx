import { SavedItemsStackParamList } from '@/app/navigation/SavedItemsStack';
import { SavedItemCard } from '@/features/saved_items/components/SavedItemCard';
import { useSavedItems } from '@/features/saved_items/hooks/useSavedItems';
import { SavedItem } from '@/features/saved_items/types';
import { ErrorState } from '@/shared/components/ErrorState';
import { Loader } from '@/shared/components/Loader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

type SavedItemsScreenNavigationProp = NativeStackNavigationProp<
  SavedItemsStackParamList,
  'SavedItems'
>;

export const SavedItemsScreen: React.FC = () => {
  const navigation = useNavigation<SavedItemsScreenNavigationProp>();
  const {
    savedItems,
    isLoading,
    error,
    toggleSave,
    isToggling,
    clearError,
    refetchAllItems,
  } = useSavedItems();

  const handleToggleSave = React.useCallback(
    async (itemId: string, currentSavedStatus: boolean) => {
      try {
        await toggleSave({ itemId, isSaved: !currentSavedStatus });

        // Show success alert
        Alert.alert(
          'Success',
          'Item removed from saved items!',
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
    (itemId: string) => {
      navigation.navigate('ItemDetail', { itemId });
    },
    [navigation]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: SavedItem }) => (
      <SavedItemCard
        item={item}
        onPress={() => handleItemPress(item.id)}
        onToggleSave={() => handleToggleSave(item.id, item.isSaved)}
        isToggling={isToggling}
      />
    ),
    [handleItemPress, handleToggleSave, isToggling]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : String(error)}
        onRetry={() => {
          clearError();
          refetchAllItems();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Items</Text>
        <Text style={styles.count}>{savedItems.length} items</Text>
      </View>

      <FlatList
        data={savedItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No saved items yet</Text>
            <Text style={styles.emptySubtext}>
              Save items from the main list to see them here
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  count: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
