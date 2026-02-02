import { Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const useVirtualizedListOptimizations = () => {
  return {
    getItemLayout:
      (itemHeight: number) =>
      (data: ArrayLike<unknown> | null | undefined, index: number) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      }),
    calculateInitialNumToRender: (estimatedItemSize: number) =>
      Math.ceil(SCREEN_HEIGHT / estimatedItemSize) + 5,
  };
};
