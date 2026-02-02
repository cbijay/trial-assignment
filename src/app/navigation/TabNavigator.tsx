import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeStack } from './HomeStack';
import { SavedItemsTabStack } from './SavedItemsTabStack';

export type TabParamList = {
  Home: undefined;
  SavedItems: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedItems"
        component={SavedItemsTabStack}
        options={{
          tabBarLabel: 'Saved Items',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

