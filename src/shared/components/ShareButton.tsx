import { generateShareableLink } from '@/shared/utils/dynamicLinks';
import React from 'react';
import { Alert, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ShareButtonProps {
  itemId: string;
  itemTitle?: string;
  size?: 'small' | 'medium' | 'large';
  style?: object;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  itemId,
  itemTitle = 'Check out this item',
  size = 'medium',
  style,
}) => {
  const handleShare = async () => {
    try {
      const shareableLink = await generateShareableLink(itemId);

      const shareOptions = {
        message: `${itemTitle}\n\n${shareableLink}`,
        url: shareableLink,
        title: itemTitle,
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing item:', error);
      Alert.alert(
        'Share Failed',
        'Unable to share this item. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, borderRadius: 16 };
      case 'large':
        return { width: 56, height: 56, borderRadius: 28 };
      default:
        return { width: 44, height: 44, borderRadius: 22 };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, getSizeStyles(), style]}
      onPress={handleShare}
      accessibilityRole="button"
      accessibilityLabel={`Share ${itemTitle}`}
    >
      <View style={styles.iconContainer}>
        <Icon name="share-social" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  shareDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    top: 8,
    left: 8,
  },
  shareLine: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  lineTop: {
    width: 8,
    height: 2,
    top: 4,
    left: 6,
  },
  lineRight: {
    width: 2,
    height: 8,
    top: 6,
    right: 4,
  },
  lineBottom: {
    width: 8,
    height: 2,
    bottom: 4,
    left: 6,
  },
});
