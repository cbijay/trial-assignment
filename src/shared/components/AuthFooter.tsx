import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AuthFooterProps {
  linkText: string;
  actionText: string;
  targetScreen: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  linkText,
  actionText,
  targetScreen,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(targetScreen as never);
  };

  return (
    <TouchableOpacity
      style={styles.link}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.linkText}>
        {linkText}{' '}
        <Text style={styles.linkHighlight}>{actionText}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    alignItems: 'center',
    marginTop: 30
  },
  linkText: {
    color: '#6b7280',
    fontSize: 15,
    fontWeight: '400',
  },
  linkHighlight: {
    color: '#6366f1',
    fontWeight: '600',
  },
});
