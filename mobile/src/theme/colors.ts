export const theme = {
  colors: {
    // Background colors
    background: '#0B1426', // Dark blue-gray base (200 25% 6%)
    surface: '#101B2E', // Card background (195 20% 8%)
    surfaceVariant: '#0D1523', // Elevated surface (200 25% 7%)
    
    // Text colors
    text: '#F0F4F8', // Primary text (180 5% 95%)
    textSecondary: '#9BA8B3', // Secondary text (180 5% 70%)
    textTertiary: '#7A8891', // Tertiary text (180 5% 65%)
    
    // Primary colors (Cyan theme)
    primary: '#00D9FF', // Main cyan (185 100% 60%)
    primaryLight: '#33E1FF', // Lighter cyan
    primaryDark: '#00A3CC', // Darker cyan
    
    // Accent colors
    accent: '#00FF94', // Bright green accent (170 100% 55%)
    accentLight: '#33FFAA', // Lighter accent
    accentDark: '#00CC77', // Darker accent
    
    // Tertiary glow color
    tertiary: '#00FFCC', // Aqua tertiary (160 100% 50%)
    tertiaryLight: '#33FFDD', // Lighter tertiary
    tertiaryDark: '#00CCA3', // Darker tertiary
    
    // Status colors
    success: '#00FF94',
    warning: '#FFB800',
    error: '#FF4757',
    info: '#00D9FF',
    
    // Border and divider
    border: '#1A2B3D', // Border color (195 30% 20%)
    borderLight: '#243447', // Lighter border
    divider: '#152230', // Divider color
    
    // Glass morphism
    glassBackground: 'rgba(16, 27, 46, 0.3)', // Semi-transparent surface
    glassBorder: 'rgba(0, 217, 255, 0.3)', // Semi-transparent primary
    
    // Gradients
    gradientPrimary: ['#00D9FF', '#00FF94', '#00FFCC'],
    gradientBackground: ['#0B1426', '#0A1220'],
    gradientSurface: ['#101B2E', '#0D1523'],
  },
  
  // Glow effects
  glow: {
    primary: {
      shadowColor: '#00D9FF',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 8,
    },
    accent: {
      shadowColor: '#00FF94',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 8,
    },
    tertiary: {
      shadowColor: '#00FFCC',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.6,
      shadowRadius: 15,
      elevation: 8,
    },
    soft: {
      shadowColor: '#00D9FF',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 4,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 50,
  },
  
  // Typography
  typography: {
    fontFamily: 'System',
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      title: 28,
      display: 32,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

export type Theme = typeof theme;
