import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButton } from './ActionButton';

interface ItemActionsProps {
  isSaved: boolean;
  isToggling: boolean;
  onSaveToggle: () => void;
  onShare: () => void;
}

export const ItemActions: React.FC<ItemActionsProps> = ({
  isSaved,
  isToggling,
  onSaveToggle,
  onShare,
}) => {
  return (
    <View style={styles.actionContainer}>
      <ActionButton
        title={isSaved ? 'Saved' : 'Save'}
        onPress={onSaveToggle}
        disabled={isToggling}
        loading={isToggling}
        variant={isSaved ? 'primary' : 'secondary'}
        icon={isSaved ? 'bookmark' : 'bookmark-outline'}
      />

      <ActionButton
        title="Share"
        onPress={onShare}
        variant="secondary"
        icon="share-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
});
