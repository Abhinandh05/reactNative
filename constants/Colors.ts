const Palette = {
  primary: '#6366F1', // Indigo 500 - Softer than 600
  primaryDark: '#4338CA', // Indigo 700
  primaryLight: '#818CF8', // Indigo 400
  accent: '#06B6D4', // Cyan 500

  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',

  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
  textTertiary: '#94A3B8', // Slate 400

  border: '#E2E8F0', // Slate 200

  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500

  // Dark Mode
  darkBackground: '#0F172A', // Slate 900
  darkSurface: '#1E293B', // Slate 800
  darkBorder: '#334155', // Slate 700
  darkText: '#F8FAFC', // Slate 50
  darkTextSecondary: '#94A3B8', // Slate 400
};

export const Colors = {
  light: {
    text: Palette.text,
    textSecondary: Palette.textSecondary,
    background: Palette.background,
    surface: Palette.surface,
    tint: Palette.primary,
    icon: Palette.textSecondary,
    tabIconDefault: Palette.textTertiary,
    tabIconSelected: Palette.primary,
    primary: Palette.primary,
    primaryForeground: '#FFFFFF',
    secondary: Palette.surface,
    border: Palette.border,
    error: Palette.error,
    success: Palette.success,
    warning: Palette.warning,
    card: Palette.surface,
    shimmer: ['#E2E8F0', '#F1F5F9', '#E2E8F0'],
  },
  dark: {
    text: Palette.darkText,
    textSecondary: Palette.darkTextSecondary,
    background: Palette.darkBackground,
    surface: Palette.darkSurface,
    tint: Palette.primaryLight,
    icon: Palette.darkTextSecondary,
    tabIconDefault: Palette.darkTextSecondary,
    tabIconSelected: Palette.primaryLight,
    primary: Palette.primary,
    primaryForeground: '#FFFFFF',
    secondary: Palette.darkSurface,
    border: Palette.darkBorder,
    error: Palette.error,
    success: Palette.success,
    warning: Palette.warning,
    card: Palette.darkSurface,
    shimmer: ['#1E293B', '#334155', '#1E293B'],
  },
  gradient: {
    primary: [Palette.primary, Palette.accent] as const,
    card: ['#1E293B', '#0F172A'] as const, // Dark mode card gradient
  }
};

export default Colors;
