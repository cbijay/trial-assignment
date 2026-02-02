export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const borderRadiusStyles = {
  none: { borderRadius: borderRadius.none },
  sm: { borderRadius: borderRadius.sm },
  md: { borderRadius: borderRadius.md },
  lg: { borderRadius: borderRadius.lg },
  xl: { borderRadius: borderRadius.xl },
  '2xl': { borderRadius: borderRadius['2xl'] },
  '3xl': { borderRadius: borderRadius['3xl'] },
  full: { borderRadius: borderRadius.full },
};
