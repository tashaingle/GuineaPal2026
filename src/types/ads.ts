import { StyleProp, ViewStyle } from 'react-native';

// Banner ad size type
export type BannerAdSizeType = 'BANNER' | 'FULL_BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE' | 'LEADERBOARD' | 'ADAPTIVE_BANNER';

// Request options
export interface RequestOptions {
  requestNonPersonalizedAdsOnly: boolean;
  keywords: string[];
}

// Ad error type
export interface AdError {
  code: string;
  message: string;
}

// Interstitial ad instance
export interface InterstitialAdInstance {
  load: () => Promise<void>;
  show: () => Promise<void>;
  loaded: boolean;
}

// Banner ad props
export interface BannerAdProps {
  unitId: string;
  size: BannerAdSizeType;
  requestOptions: RequestOptions;
  onAdFailedToLoad: (error: AdError) => void;
}

// Ad module types
export interface AdModule {
  BannerAd: React.ComponentType<BannerAdProps>;
  BannerAdSize: BannerAdSizeType;
  InterstitialAd: {
    createForAdRequest: (unitId: string, requestOptions: RequestOptions) => InterstitialAdInstance;
  };
  MobileAds: () => Promise<void>;
}

// Banner ad component props
export interface BannerAdComponentProps {
  size?: BannerAdSizeType;
  style?: StyleProp<ViewStyle>;
} 