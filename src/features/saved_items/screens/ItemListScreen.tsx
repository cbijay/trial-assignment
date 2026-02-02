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
import { SafeAreaView } from 'react-native-safe-area-context';

type ItemListScreenNavigationProp = NativeStackNavigationProp<
  SavedItemsStackParamList,
  'ItemList'
>;

export const ItemListScreen: React.FC = () => {
  const navigation = useNavigation<ItemListScreenNavigationProp>();
  const {
    items,
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
      } catch {
        Alert.alert('Error', 'Failed to update item status');
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

  const header = () => (
    <View style={styles.header}>
      <Text style={styles.title}>All Items</Text>
    </View>
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        message={typeof error === 'string' ? error : error.message}
        onRetry={() => {
          clearError();
          refetchAllItems();
        }}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {header()}
      <FlatList
        data={items}
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
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  adminButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
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
  },
});
