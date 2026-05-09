// Miami Neon Color Palette
// Design tokens for consistent color usage across the application

export const colors = {
  // Backgrounds
  backgrounds: {
    primary: '#0A0E27',
    secondary: '#1A1F3A',
    card: '#151B2F',
    dark: '#0A0E27',
    overlay: 'rgba(10, 14, 39, 0.8)',
  },

  // Primary Accent Colors (Miami Neon)
  primary: {
    magenta: '#FF006E',
    magentaLight: '#FF1493',
    magentaBright: '#FF2D78',
  },

  // Secondary Accent Colors
  secondary: {
    cyan: '#00F5FF',
    orange: '#FF6B35',
    lime: '#39FF14',
    blue: '#0088FF',
    purple: '#9D00FF',
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B5C0',
    muted: '#6B7280',
    inverse: '#0A0E27',
  },

  // Status Colors
  status: {
    success: '#39FF14',
    error: '#FF006E',
    warning: '#FF6B35',
    info: '#00F5FF',
  },

  // Borders & Dividers
  border: {
    light: 'rgba(255, 0, 110, 0.1)',
    medium: 'rgba(255, 0, 110, 0.2)',
    strong: 'rgba(255, 0, 110, 0.3)',
  },

  // Gradients
  gradients: {
    miami: 'linear-gradient(135deg, #FF006E 0%, #FF6B35 50%, #00F5FF 100%)',
    magentaCyan: 'linear-gradient(90deg, #FF006E 0%, #00F5FF 100%)',
    orangeMagenta: 'linear-gradient(135deg, #FF6B35 0%, #FF006E 100%)',
    dark: 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 1) 100%)',
    card: 'linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(0, 245, 255, 0.05) 100%)',
  },

  // Shadows & Glows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  glows: {
    magenta: '0 0 30px rgba(255, 0, 110, 0.6)',
    cyan: '0 0 30px rgba(0, 245, 255, 0.6)',
    orange: '0 0 30px rgba(255, 107, 53, 0.6)',
    lime: '0 0 30px rgba(57, 255, 20, 0.4)',
    neonMagenta: '0 0 20px rgba(255, 0, 110, 0.8), 0 0 40px rgba(255, 0, 110, 0.4)',
    neonCyan: '0 0 20px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 245, 255, 0.4)',
  },
} as const;

// Semantic color usage patterns
export const semanticColors = {
  // Interactive elements
  button: {
    primary: {
      bg: colors.primary.magenta,
      text: colors.backgrounds.dark,
      hover: colors.primary.magentaLight,
      glow: colors.glows.magenta,
    },
    secondary: {
      bg: 'transparent',
      border: colors.primary.magenta,
      text: colors.primary.magenta,
      hover: colors.primary.magentaLight,
    },
    danger: {
      bg: colors.status.error,
      text: colors.backgrounds.dark,
      hover: colors.primary.magentaLight,
    },
  },

  // Cards & Containers
  card: {
    bg: colors.backgrounds.card,
    border: colors.border.medium,
    hover: colors.border.strong,
  },

  // Form inputs
  input: {
    bg: colors.backgrounds.secondary,
    border: colors.border.light,
    focus: colors.primary.magenta,
    text: colors.text.primary,
  },

  // Navigation
  nav: {
    bg: colors.backgrounds.secondary,
    link: colors.text.secondary,
    linkActive: colors.primary.magenta,
    border: colors.border.light,
  },

  // Badges & Tags
  badge: {
    neutral: {
      bg: 'rgba(255, 0, 110, 0.1)',
      text: colors.primary.magenta,
    },
    success: {
      bg: 'rgba(57, 255, 20, 0.1)',
      text: colors.status.success,
    },
    error: {
      bg: 'rgba(255, 0, 110, 0.1)',
      text: colors.status.error,
    },
  },
} as const;
