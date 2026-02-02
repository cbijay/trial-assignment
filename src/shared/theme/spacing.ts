export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '8xl': 80,
  '12xl': 96,
};

export const spacingStyles = {
  // Padding
  p: {
    xs: { padding: spacing.xs },
    sm: { padding: spacing.sm },
    md: { padding: spacing.md },
    lg: { padding: spacing.lg },
    xl: { padding: spacing.xl },
    '2xl': { padding: spacing['2xl'] },
    '3xl': { padding: spacing['3xl'] },
  },
  
  px: {
    xs: { paddingHorizontal: spacing.xs },
    sm: { paddingHorizontal: spacing.sm },
    md: { paddingHorizontal: spacing.md },
    lg: { paddingHorizontal: spacing.lg },
    xl: { paddingHorizontal: spacing.xl },
    '2xl': { paddingHorizontal: spacing['2xl'] },
    '3xl': { paddingHorizontal: spacing['3xl'] },
  },
  
  py: {
    xs: { paddingVertical: spacing.xs },
    sm: { paddingVertical: spacing.sm },
    md: { paddingVertical: spacing.md },
    lg: { paddingVertical: spacing.lg },
    xl: { paddingVertical: spacing.xl },
    '2xl': { paddingVertical: spacing['2xl'] },
    '3xl': { paddingVertical: spacing['3xl'] },
  },
  
  // Margin
  m: {
    xs: { margin: spacing.xs },
    sm: { margin: spacing.sm },
    md: { margin: spacing.md },
    lg: { margin: spacing.lg },
    xl: { margin: spacing.xl },
    '2xl': { margin: spacing['2xl'] },
    '3xl': { margin: spacing['3xl'] },
  },
  
  mx: {
    xs: { marginHorizontal: spacing.xs },
    sm: { marginHorizontal: spacing.sm },
    md: { marginHorizontal: spacing.md },
    lg: { marginHorizontal: spacing.lg },
    xl: { marginHorizontal: spacing.xl },
    '2xl': { marginHorizontal: spacing['2xl'] },
    '3xl': { marginHorizontal: spacing['3xl'] },
  },
  
  my: {
    xs: { marginVertical: spacing.xs },
    sm: { marginVertical: spacing.sm },
    md: { marginVertical: spacing.md },
    lg: { marginVertical: spacing.lg },
    xl: { marginVertical: spacing.xl },
    '2xl': { marginVertical: spacing['2xl'] },
    '3xl': { marginVertical: spacing['3xl'] },
  },
  
  // Gap
  gap: {
    xs: { gap: spacing.xs },
    sm: { gap: spacing.sm },
    md: { gap: spacing.md },
    lg: { gap: spacing.lg },
    xl: { gap: spacing.xl },
    '2xl': { gap: spacing['2xl'] },
    '3xl': { gap: spacing['3xl'] },
  },
};
