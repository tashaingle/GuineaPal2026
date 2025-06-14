const colors = {
  // Primary brand colors
  primary: {
    DEFAULT: '#5D4037',
    light: '#8D6E63',
    dark: '#321911'
  },
  
  // Secondary colors
  secondary: {
    DEFAULT: '#795548',
    light: '#A1887F',
    dark: '#4B2C20'
  },

  // Background colors
  background: {
    DEFAULT: '#FFF8E1', // Dutch white - main background
    card: '#FFFFFF', // White - card backgrounds
    elevated: '#F5F5F5'
  },

  // Text colors
  text: {
    primary: '#5D4037',
    secondary: '#795548',
    muted: '#9E9E9E',
    light: '#FFFFFF'
  },

  // Accent colors
  accent: {
    primary: '#f3aa5d', // Sandy brown
    secondary: '#d37436', // Cocoa Brown
  },

  // Status colors
  status: {
    success: '#84cc16', // Green
    warning: '#f3aa5d', // Sandy brown
    error: '#dc2626', // Red
    info: '#d37436', // Cocoa Brown
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

  // Border colors
  border: {
    light: '#E0E0E0',
    DEFAULT: '#BDBDBD',
    dark: '#9E9E9E'
  },

  // Shadow colors
  shadow: {
    DEFAULT: 'rgba(0, 0, 0, 0.1)',
    light: 'rgba(0, 0, 0, 0.05)',
    dark: 'rgba(0, 0, 0, 0.2)'
  },

  // Utility colors
  white: '#FFFFFF',
  black: '#000000',

  // Semantic color mapping
  urgency: {
    low: '#84cc16', // Green
    medium: '#f3aa5d', // Sandy brown
    high: '#dc2626', // Red
  },

  // Color variations for components
  components: {
    card: {
      background: '#feedcc', // Papaya whip
      border: '#fef1d7', // Papaya whip-600
      shadow: 'rgba(138, 68, 20, 0.1)', // Russet with opacity
    },
    input: {
      background: '#ffffff',
      border: '#de9b64', // Caramel-600
      placeholder: '#e6b48b', // Caramel-700
    },
    header: {
      background: '#d6833e', // Caramel
      text: '#ffffff',
    },
  }
} as const;

export default colors; 