import Constants from 'expo-constants';

interface Env {
  // Add other environment variables here as needed
}

// Get the environment variables from app.config.js or app.json
const env = Constants.expoConfig?.extra?.env as Env;

if (!env) {
  throw new Error('Environment variables are not properly configured');
}

export default env; 