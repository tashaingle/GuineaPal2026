export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#0a7ea4',
    light: '#4dabf5',
    dark: '#005073',
  },

  // Secondary colors
  secondary: {
    DEFAULT: '#5D4037',
    light: '#8B6B61',
    dark: '#321911',
  },

  // Background colors - standardized to match welcome screen
  background: {
    DEFAULT: '#FFF8E1', // Light cream background (main screen background)
    light: '#FFF8E1',   // Same as default for consistency
    dark: '#F5F5F5',
    card: '#FFFFFF',    // White for all cards/buttons
    elevated: '#F8F9FA',
  },

  // Text colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#757575',
    dark: '#000000',
    muted: '#9E9E9E',
  },

  // Status colors
  status: {
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
  },

  // Border colors
  border: {
    DEFAULT: '#E0E0E0',
    light: '#F5F5F5',
    dark: '#BDBDBD',
  },

  // Shadow colors
  shadow: {
    DEFAULT: '#000000',
  },

  // Overlay colors
  overlay: {
    DEFAULT: 'rgba(0, 0, 0, 0.5)',
  },

  // Transparent
  transparent: 'transparent',

  // Base colors
  white: '#FFFFFF',
  black: '#000000',

  // Material Design colors
  amber: '#FFC107',
  brown: '#795548',
  grey: '#9E9E9E',
  red: '#D32F2F',
  orange: '#F57C00',
  yellow: '#FFEB3B',
  lime: '#CDDC39',
  green: '#4CAF50',
  teal: '#009688',
  cyan: '#00BCD4',
  blue: '#2196F3',
  indigo: '#3F51B5',
  purple: '#9C27B0',
  pink: '#E91E63',

  // Accent colors
  accent: {
    primary: '#f3aa5d', // Sandy brown
    secondary: '#d37436', // Cocoa Brown
  },

  // Button colors
  buttons: {
    primary: '#5D4037',
    secondary: '#795548',
    red: '#F44336',
    green: '#4CAF50',
    blue: '#2196F3',
    brown: '#8a4414', // Russet
    orange: '#f3aa5d', // Sandy brown
    purple: '#9C27B0',
    indigo: '#3F51B5',
    gold: '#FFD700' // Adding gold color
  },

  // Semantic color mapping
  urgency: {
    low: '#84cc16', // Green
    medium: '#f3aa5d', // Sandy brown
    high: '#dc2626', // Red
  },

  // Color variations for components - standardized to match welcome screen
  components: {
    card: {
      background: '#FFFFFF', // White for all cards
      border: '#E0E0E0',     // Light border
      shadow: 'rgba(0, 0, 0, 0.1)', // Consistent shadow
    },
    input: {
      background: '#FFFFFF', // White for inputs
      border: '#E0E0E0',     // Light border
      placeholder: '#9E9E9E', // Muted text
    },
    header: {
      background: '#FFFFFF', // White for headers
      text: '#212121',       // Dark text
    },
  }
} as const;

// Utility functions to get color values as strings
export const getColor = {
  // Primary colors
  primary: (): string => colors.primary.DEFAULT,
  primaryLight: (): string => colors.primary.light,
  primaryDark: (): string => colors.primary.dark,

  // Secondary colors
  secondary: (): string => colors.secondary.DEFAULT,
  secondaryLight: (): string => colors.secondary.light,
  secondaryDark: (): string => colors.secondary.dark,

  // Background colors
  background: (): string => colors.components.card.background,
  backgroundLight: (): string => colors.background.light,
  backgroundDark: (): string => colors.background.dark,
  backgroundCard: (): string => colors.background.card,
  backgroundElevated: (): string => colors.background.elevated,

  // Text colors
  text: (): string => colors.text.primary,
  textSecondary: (): string => colors.text.secondary,
  textLight: (): string => colors.text.light,
  textDark: (): string => colors.text.dark,
  textMuted: (): string => colors.text.muted,

  // Status colors
  success: (): string => colors.status.success,
  warning: (): string => colors.status.warning,
  error: (): string => colors.status.error,
  info: (): string => colors.status.info,

  // Border colors
  border: (): string => colors.border.DEFAULT,
  borderLight: (): string => colors.border.light,
  borderDark: (): string => colors.border.dark,

  // Shadow colors
  shadow: (): string => colors.shadow.DEFAULT,

  // Overlay colors
  overlay: (): string => colors.overlay.DEFAULT,
  modalOverlay: (): string => colors.overlay.DEFAULT,

  // Component colors
  cardBackground: (): string => '#FFFFFF',
  cardBorder: (): string => colors.components.card.border,
  cardShadow: (): string => colors.components.card.shadow,
  inputBackground: (): string => colors.components.input.background,
  inputBorder: (): string => colors.components.input.border,
  inputPlaceholder: (): string => colors.components.input.placeholder,
  headerBackground: (): string => colors.components.header.background,
  headerText: (): string => colors.components.header.text,

  // Accent colors
  accentPrimary: (): string => colors.accent.primary,
  accentSecondary: (): string => colors.accent.secondary,

  // Button colors
  buttonPrimary: (): string => '#FFFFFF',
  buttonSecondary: (): string => colors.buttons.secondary,
  buttonRed: (): string => colors.buttons.red,
  buttonGreen: (): string => colors.buttons.green,
  buttonBlue: (): string => colors.buttons.blue,
  buttonBrown: (): string => colors.buttons.brown,
  buttonOrange: (): string => colors.buttons.orange,
  buttonPurple: (): string => colors.buttons.purple,
  buttonIndigo: (): string => colors.buttons.indigo,
  buttonGold: (): string => colors.buttons.gold,

  // Urgency colors
  urgencyLow: (): string => colors.urgency.low,
  urgencyMedium: (): string => colors.urgency.medium,
  urgencyHigh: (): string => colors.urgency.high,

  // Additional colors
  transparent: (): string => colors.transparent,
  white: (): string => colors.white,
  black: (): string => colors.black,
  amber: (): string => colors.amber,
  brown: (): string => colors.brown,
  grey: (): string => colors.grey,
  red: (): string => colors.red,
  orange: (): string => colors.orange,
  yellow: (): string => colors.yellow,
  lime: (): string => colors.lime,
  green: (): string => colors.green,
  teal: (): string => colors.teal,
  cyan: (): string => colors.cyan,
  blue: (): string => colors.blue,
  indigo: (): string => colors.indigo,
  purple: (): string => colors.purple,
  pink: (): string => colors.pink,
  creamy: (): string => '#FDF6ED',
};

export type ColorKey = keyof typeof colors;

export default colors; 