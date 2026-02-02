import { ItemDetailScreen } from '@/features/saved_items/screens/ItemDetailScreen';
import { ItemListScreen } from '@/features/saved_items/screens/ItemListScreen';
import { SavedItemsScreen } from '@/features/saved_items/screens/SavedItemsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type SavedItemsStackParamList = {
  ItemList: undefined;
  SavedItems: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<SavedItemsStackParamList>();

export const SavedItemsStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={{ title: 'All Items' }}
      />
      <Stack.Screen
        name="SavedItems"
        component={SavedItemsScreen}
        options={{ title: 'Saved Items' }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item Details' }}
      />
    </Stack.Navigator>
  );
};
