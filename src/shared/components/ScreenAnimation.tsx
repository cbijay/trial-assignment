import { useScreenAnimation } from '@/shared/hooks/useScreenAnimation';
import React from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ScreenAnimationProps {
  children: React.ReactNode;
  fadeValue?: Animated.Value;
  slideValue?: Animated.Value;
  duration?: number;
  delay?: number;
  enabled?: boolean;
}

export const ScreenAnimation: React.FC<ScreenAnimationProps> = ({
  children,
  fadeValue,
  slideValue,
  duration = 800,
  delay = 0,
  enabled = true,
}) => {
  const { fadeAnim, slideAnim } = useScreenAnimation(duration, delay);

  const animatedStyle: ViewStyle = enabled
    ? {
      opacity: fadeValue || fadeAnim,
      transform: [
        { translateY: slideValue || slideAnim },
      ],
    }
    : {};

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};
