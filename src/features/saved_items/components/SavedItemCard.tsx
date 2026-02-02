import { SavedItem } from '@/features/saved_items/types';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SavedItemCardProps {
  item: SavedItem;
  onPress: () => void;
  onToggleSave: () => void;
  isToggling?: boolean;
}

export const SavedItemCard = React.memo<SavedItemCardProps>(({
  item,
  onPress,
  onToggleSave,
  isToggling = false,
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
    onToggleSave();
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
    onPress();
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
            <TouchableOpacity
              testID="save-button"
              style={[styles.saveButton, item.isSaved && styles.saveButtonActive]}
              onPress={handleToggleSave}
              disabled={isToggling}
            >
              <Icon
                testID="save-icon"
                name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={item.isSaved ? '#fff' : '#FF3B30'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

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
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
});
