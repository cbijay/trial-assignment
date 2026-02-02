import { Item } from '@/features/home_items/types';
import { ItemActions } from '@/shared/components/ItemActions';
import { commonStyles } from '@/shared/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ItemDetailContentProps {
  item: Item;
  isItemSaved: boolean;
  isToggling: boolean;
  onToggleSave: () => void;
  onShare: () => void;
}

export const ItemDetailContent: React.FC<ItemDetailContentProps> = ({
  item,
  isItemSaved,
  isToggling,
  onToggleSave,
  onShare,
}) => {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <ItemActions
        isSaved={isItemSaved}
        isToggling={isToggling}
        onSaveToggle={onToggleSave}
        onShare={onShare}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    ...commonStyles.title,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 32,
  },
});
