export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,

  // Font weights
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line heights
  tightLineHeight: 1.2,
  normalLineHeight: 1.4,
  relaxedLineHeight: 1.6,

  // Letter spacing
  tightLetterSpacing: -0.5,
  normalLetterSpacing: 0,
  wideLetterSpacing: 0.5,
  widerLetterSpacing: 1,
};

export const textStyles = {
  // Headings
  h1: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
    color: '#1f2937',
    lineHeight: 38,
  },
  h2: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: '#1f2937',
    lineHeight: 34,
  },
  h3: {
    fontSize: typography['2xl'],
    fontWeight: typography.semibold,
    color: '#1f2937',
    lineHeight: 30,
  },

  // Body text
  bodyLarge: {
    fontSize: typography.lg,
    fontWeight: typography.normal,
    color: '#1f2937',
    lineHeight: 26,
  },
  body: {
    fontSize: typography.base,
    fontWeight: typography.normal,
    color: '#1f2937',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: typography.sm,
    fontWeight: typography.normal,
    color: '#6b7280',
    lineHeight: 20,
  },

  // UI text
  caption: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    color: '#6b7280',
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: '#374151',
  },

  // Button text
  buttonLarge: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: '#ffffff',
  },
  button: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: '#ffffff',
  },
  buttonSmall: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: '#ffffff',
  },
};
