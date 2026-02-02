export * from './borderRadius';
export * from './colors';
export * from './shadows';
export * from './spacing';
export * from './typography';

import { StyleSheet } from 'react-native';
import { borderRadius } from './borderRadius';
import { colors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { textStyles, typography } from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
};

// Common reusable styles
export const createCommonStyles = () =>
  StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Card styles
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },

    // Button styles
    button: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.primary,
    },

    buttonSecondary: {
      backgroundColor: colors.gray100,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      ...textStyles.button,
      color: colors.textInverse,
    },

    buttonSecondaryText: {
      ...textStyles.button,
      color: colors.primary,
    },

    // Input styles
    input: {
      backgroundColor: colors.gray50,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      fontSize: typography.base,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: spacing.md,
    },

    inputError: {
      borderColor: colors.error,
      backgroundColor: '#fef2f2',
    },

    // Text styles
    title: {
      ...textStyles.h2,
      marginBottom: spacing.md,
    },

    subtitle: {
      ...textStyles.bodySmall,
      marginBottom: spacing.lg,
    },

    errorText: {
      ...textStyles.caption,
      color: colors.error,
      marginTop: -spacing.md,
      marginBottom: spacing.md,
      marginLeft: spacing.sm,
    },

    // Layout styles
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Loading and empty states
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: spacing.xl,
    },

    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingVertical: spacing['5xl'],
      paddingHorizontal: spacing['4xl'],
    },

    emptyText: {
      ...textStyles.h3,
      color: colors.textSecondary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },

    emptySubtext: {
      ...textStyles.bodySmall,
      textAlign: 'center',
    },
  });

export const commonStyles = createCommonStyles();
