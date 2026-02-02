import { ItemDetailScreen } from '@/features/saved_items/screens/ItemDetailScreen';
import { SavedItemsScreen } from '@/features/saved_items/screens/SavedItemsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type SavedItemsTabParamList = {
  SavedItems: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<SavedItemsTabParamList>();

export const SavedItemsTabStack: React.FC = () => {
  return (
    <Stack.Navigator>
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
