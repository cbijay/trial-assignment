import { Item } from '@/features/home_items/types';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ItemCardProps {
  item: Item;
  onPress: (item: Item) => void;
  onToggleSave?: (itemId: string, currentSavedStatus: boolean) => void;
  isSaved?: boolean;
  isToggling?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  onToggleSave,
  isSaved = false,
  isToggling = false
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleToggleSave = (e: import('react-native').GestureResponderEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(item.id, isSaved);
    }
  };

  const handleCardPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(item);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.9} style={styles.cardContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            {onToggleSave && (
              <TouchableOpacity
                testID="save-button"
                style={[styles.saveButton, isSaved && styles.saveButtonActive]}
                onPress={handleToggleSave}
                disabled={isToggling}
              >
                <Icon
                  testID="save-icon"
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={isSaved ? '#fff' : '#FF3B30'}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  saveButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  saveButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 24,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    alignSelf: 'flex-start',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
});
