import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface ItemDetailLoadingProps {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const ItemDetailLoading: React.FC<ItemDetailLoadingProps> = ({
  fadeAnim,
  slideAnim,
}) => {
  return (
    <View style={styles.content}>
      <Animated.View
        style={[
          styles.loadingCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  loadingCard: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});
