declare module 'expo-media-library' {
  export interface Album {
    id: string;
    title: string;
    assetCount: number;
  }

  export interface Asset {
    id: string;
    filename: string;
    uri: string;
    mediaType: 'photo' | 'video';
    width: number;
    height: number;
    creationTime: number;
    modificationTime: number;
    duration: number;
    mediaSubtypes: string[];
  }

  export interface MediaLibraryOptions {
    first?: number;
    after?: string;
    album?: string;
    sortBy?: Array<'default' | 'id' | 'mediaType' | 'width' | 'height' | 'creationTime' | 'modificationTime' | 'duration'>;
    mediaType?: Array<'photo' | 'video'>;
  }

  export function getAlbumsAsync(): Promise<Album[]>;
  export function getAssetsAsync(options?: MediaLibraryOptions): Promise<{ assets: Asset[]; endCursor: string; hasNextPage: boolean; totalCount: number }>;
  export function createAlbumAsync(albumName: string, asset?: Asset, copyAsset?: boolean): Promise<Album>;
  export function deleteAlbumsAsync(albumIds: string[], deleteAssets?: boolean): Promise<void>;
  export function getAssetInfoAsync(asset: Asset): Promise<Asset>;
  export function deleteAssetsAsync(assets: Asset[]): Promise<void>;
  export function saveToLibraryAsync(localUri: string): Promise<void>;
  export function requestPermissionsAsync(): Promise<{ status: 'granted' | 'denied' }>;
  export function createAssetAsync(localUri: string): Promise<Asset>;
  export function addAssetsToAlbumAsync(assets: Asset[], albumId: string, copyAssets?: boolean): Promise<void>;
} 