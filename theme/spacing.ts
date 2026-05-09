// Spacing Scale
// Consistent spacing values used throughout the application

export const spacing = {
  // Base unit: 4px
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// Common spacing patterns
export const spacingPatterns = {
  // Component padding
  componentPadding: {
    xs: '0.5rem', // 8px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
  },

  // Section margins
  sectionMargin: {
    sm: '2rem', // 32px
    md: '3rem', // 48px
    lg: '4rem', // 64px
    xl: '6rem', // 96px
  },

  // Gap between items
  gap: {
    xs: '0.5rem', // 8px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
  },

  // Responsive mobile/desktop
  responsive: {
    mobile: {
      padding: '1rem', // 16px
      margin: '1rem', // 16px
      gap: '0.75rem', // 12px
    },
    tablet: {
      padding: '1.5rem', // 24px
      margin: '1.5rem', // 24px
      gap: '1rem', // 16px
    },
    desktop: {
      padding: '2rem', // 32px
      margin: '2rem', // 32px
      gap: '1.5rem', // 24px
    },
  },
} as const;

// Common sizes
export const sizes = {
  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem', // 4px
    base: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    full: '9999px',
  },

  // Touch targets (minimum 44x44px for accessibility)
  touchTarget: {
    sm: '2.75rem', // 44px
    md: '3rem', // 48px
    lg: '3.5rem', // 56px
  },

  // Container widths
  container: {
    xs: '20rem', // 320px
    sm: '24rem', // 384px
    md: '28rem', // 448px
    lg: '32rem', // 512px
    xl: '36rem', // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px
    '6xl': '72rem', // 1152px
    '7xl': '80rem', // 1280px
    full: '100%',
  },
} as const;
