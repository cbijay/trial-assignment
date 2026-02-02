import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
  ViewStyle,
} from 'react-native';

interface VirtualizedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  itemHeight?: number;
  estimatedItemSize?: number;
  containerStyle?: ViewStyle;
  getItemLayout?: (data: ArrayLike<T> | null | undefined, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function VirtualizedList<T>({
  data,
  renderItem,
  itemHeight = 60,
  estimatedItemSize = 60,
  containerStyle,
  getItemLayout,
  ...props
}: VirtualizedListProps<T>) {
  // Optimized getItemLayout for better performance
  const optimizedGetItemLayout = useMemo(() => {
    if (getItemLayout) return getItemLayout;

    return (data: ArrayLike<T> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [getItemLayout, itemHeight]);

  // Calculate window size for initialNumToRender
  const initialNumToRender = useMemo(() => {
    return Math.ceil(SCREEN_HEIGHT / estimatedItemSize) + 5; // 5 extra items for smooth scrolling
  }, [estimatedItemSize]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      getItemLayout={optimizedGetItemLayout}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      removeClippedSubviews={true}
      keyExtractor={(item, index) => {
        if (typeof item === 'object' && item !== null && 'id' in item) {
          return (item as T & { id: string }).id;
        }
        return index.toString();
      }}
      style={containerStyle}
      {...props}
    />
  );
}
