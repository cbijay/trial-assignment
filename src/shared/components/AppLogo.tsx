import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'medium' }) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerSize: 80,
          outerSize: 80,
          middleSize: 60,
          innerSize: 32,
          dotSize: 8,
        };
      case 'large':
        return {
          containerSize: 200,
          outerSize: 200,
          middleSize: 150,
          innerSize: 80,
          dotSize: 20,
        };
      default:
        return {
          containerSize: 120,
          outerSize: 120,
          middleSize: 90,
          innerSize: 48,
          dotSize: 12,
        };
    }
  };

  const { containerSize, outerSize, middleSize, innerSize, dotSize } = getSizeConfig();

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      <View style={[styles.outerCircle, { width: outerSize, height: outerSize, borderRadius: outerSize / 2 }]} />
      <View style={[styles.middleCircle, { width: middleSize, height: middleSize, borderRadius: middleSize / 2 }]} />
      <View style={[styles.innerCircle, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
        <View style={[styles.centerDot, { width: dotSize, height: dotSize, borderRadius: dotSize / 2 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  middleCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  innerCircle: {
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  centerDot: {
    backgroundColor: '#1a1a2e',
  },
});

export default AppLogo;
