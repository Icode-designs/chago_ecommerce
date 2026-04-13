export const theme = {
  colors: {
    primary: '#1D1D1F',
    primaryHover: '#2D2D2F',
    primaryDim: '#535254',
    onPrimary: '#FAF7F9',
    primaryContainer: '#E4E2E4',
    onPrimaryContainer: '#525154',

    secondary: '#86868B',
    secondaryContainer: '#E3E2E7',
    onSecondary: '#FAF8FE',

    tertiary: '#0066CC',
    tertiaryDim: '#0051A5',
    tertiaryContainer: '#5095FE',
    onTertiary: '#FFFFFF',

    background: '#F9F9FB',
    onBackground: '#2D3338',

    surface: '#F9F9FB',
    surfaceBright: '#F9F9FB',
    surfaceDim: '#D3DBE2',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F2F4F6',
    surfaceContainer: '#EBEEF2',
    surfaceContainerHigh: '#E4E9EE',
    surfaceContainerHighest: '#DDE3E9',
    surfaceVariant: '#DDE3E9',

    onSurface: '#2D3338',
    onSurfaceVariant: '#596065',

    outline: '#757C81',
    outlineVariant: '#ACB3B8',

    error: '#9F403D',
    errorContainer: '#FE8983',
    onError: '#FFF7F6',
    onErrorContainer: '#752121',

    inverseSurface: '#0C0E10',
    inverseOnSurface: '#9C9D9F',
    inversePrimary: '#FFFFFF',

    neutral: '#F5F5F7',

    // Semantic aliases
    text: '#2D3338',
    textSecondary: '#596065',
    textTertiary: '#86868B',
    border: 'rgba(172, 179, 184, 0.15)',
    borderHover: 'rgba(93, 94, 96, 0.4)',
    overlay: 'rgba(12, 14, 16, 0.5)',
    glass: 'rgba(249, 249, 251, 0.8)',
  },

  fonts: {
    heading: "'var(--font-inter)', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'var(--font-inter)', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    label: "'var(--font-inter)', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  fontSizes: {
    displayLg: '3.5rem',    // 56px
    displayMd: '2.75rem',   // 44px
    displaySm: '2.25rem',   // 36px
    headlineLg: '2rem',     // 32px
    headlineMd: '1.75rem',  // 28px
    headlineSm: '1.5rem',   // 24px
    titleLg: '1.375rem',    // 22px
    titleMd: '1.125rem',    // 18px
    titleSm: '1rem',        // 16px
    bodyLg: '1rem',         // 16px
    bodyMd: '0.875rem',     // 14px
    bodySm: '0.75rem',      // 12px
    labelLg: '0.875rem',    // 14px
    labelMd: '0.75rem',     // 12px
    labelSm: '0.6875rem',   // 11px
  },

  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },

  letterSpacings: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
  },

  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0px 4px 12px rgba(45, 51, 56, 0.03)',
    md: '0px 8px 24px rgba(45, 51, 56, 0.05)',
    lg: '0px 12px 32px rgba(45, 51, 56, 0.06)',
    xl: '0px 20px 48px rgba(45, 51, 56, 0.08)',
    ambient: '0px 40px 60px rgba(45, 51, 56, 0.04)',
    glow: '0px 0px 0px 4px rgba(95, 94, 96, 0.1)',
    glowPrimary: '0px 0px 0px 4px rgba(0, 102, 204, 0.15)',
  },

  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1440px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  zIndices: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    popover: 500,
    toast: 600,
    tooltip: 700,
  },

  layout: {
    maxWidth: '1280px',
    headerHeight: '72px',
    sidebarWidth: '260px',
    sidebarCollapsed: '72px',
  },
} as const;

export type Theme = typeof theme;
