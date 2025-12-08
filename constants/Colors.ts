export const Palette = {
  purple: '#9D68A0',
  orchid: '#C15D9E',
  pink: '#D6538F',
  rose: '#DC517A', // Primary
  coral: '#DD536A',
  orange: '#DF5943',
};

const tintColorLight = Palette.rose;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F5F7FA', // Keep background neutral for readability
    tint: tintColorLight,
    icon: Palette.purple,
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: Palette.rose,
    secondary: '#E1E9FF', // Might need adjustment, but keeping blue-ish for contrast for now or maybe a very light pink? Let's stick to safe neutral or slight tint.
    // secondary: '#FCEEF5', // Light pink background option
    card: '#FFFFFF',
    border: '#E6E8EB',
    valid: Palette.orange, // Use orange for valid/highlight states if needed
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: Palette.rose,
    secondary: '#1A2A4D',
    card: '#1E1E1E',
    border: '#2C2C2C',
  },
  gradient: [Palette.purple, Palette.rose, Palette.orange], // Helper for gradient components
};

export default Colors;
