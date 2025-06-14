declare module 'expo-web-browser' {
  export interface WebBrowserResult {
    type: 'cancel' | 'success';
    url?: string;
  }

  export function openBrowserAsync(url: string): Promise<WebBrowserResult>;
} 