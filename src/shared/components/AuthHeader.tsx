import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { commonStyles } from '@/shared/theme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    ...commonStyles.title,
    textAlign: 'center',
  },
  subtitle: {
    ...commonStyles.subtitle,
    textAlign: 'center',
  },
});
