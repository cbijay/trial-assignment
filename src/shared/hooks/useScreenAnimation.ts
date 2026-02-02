import React from 'react';
import { Animated } from 'react-native';

export const useScreenAnimation = (
  duration: number = 800,
  delay: number = 0
) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    const fadeAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      delay,
    });

    const slideAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: duration * 0.75,
      useNativeDriver: true,
      delay,
    });

    const animation = Animated.parallel([fadeAnimation, slideAnimation]);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim, slideAnim, duration, delay]);

  return { fadeAnim, slideAnim };
};
