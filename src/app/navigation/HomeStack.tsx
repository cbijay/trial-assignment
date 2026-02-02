import { ItemDetailScreen } from '@/features/home_items/screens/ItemDetailScreen';
import { ItemListScreen } from '@/features/home_items/screens/ItemListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type HomeStackParamList = {
  ItemList: undefined;
  ItemDetail: { itemId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={{ title: 'All Items', headerShown: false }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item Details', }}
      />
    </Stack.Navigator>
  );
};
