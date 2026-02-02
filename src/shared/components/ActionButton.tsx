import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { commonStyles } from '@/shared/theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  icon?: string;
  iconPosition?: 'left' | 'right';
  activeOpacity?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  activeOpacity = 0.9,
}) => {
  const buttonStyle = [
    variant === 'primary' ? commonStyles.button : commonStyles.buttonSecondary,
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [
    variant === 'primary' ? commonStyles.buttonText : commonStyles.buttonSecondaryText,
    disabled && styles.buttonDisabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
    >
      <View style={styles.buttonContent}>
        {icon && iconPosition === 'left' && (
          <Icon 
            name={icon} 
            size={20} 
            color={variant === 'primary' ? '#ffffff' : '#6366f1'} 
            style={styles.iconLeft}
          />
        )}
        <Text style={textStyle}>
          {loading ? 'Loading...' : title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Icon 
            name={icon} 
            size={20} 
            color={variant === 'primary' ? '#ffffff' : '#6366f1'} 
            style={styles.iconRight}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabledText: {
    color: '#9ca3af',
  },
});
