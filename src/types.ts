export type MediaType = 'video' | 'image';
export type TextType = 'ticker' | 'news';

export interface MediaItem {
  id?: number;
  type: MediaType;
  name: string;
  blob?: Blob;
  url?: string; // Object URL generated at runtime
  externalUrl?: string; // For YouTube or Direct Link
  duration: number; // Duration in seconds for images, videos will play until end
  order: number;
  active: boolean;
}

export interface TextItem {
  id?: number;
  type: TextType;
  content: string;
  active: boolean;
  order: number;
}

export interface ScreenData {
  settings: AppSettings;
  media: MediaItem[];
  texts: TextItem[];
}

export interface AppSettings {
  id?: number; // Always 1
  showVideo: boolean;
  showImage: boolean;
  showTicker: boolean;
  showNews: boolean;
  showHeader: boolean;
  headerLine1?: string; // e.g. DINAS PENDIDIKAN KABUPATEN BANYUMAS
  headerLine2?: string; // e.g. UNIT PENDIDIKAN KECAMATAN KEMRANJEN
  institutionName: string; // e.g. SD NEGERI 1 KARANGJATI
  institutionAddress: string; // e.g. Alamat, RT/RW, Telp, Email
  showHeaderDivider?: boolean;
  headerAlignment?: 'left' | 'center' | 'right';
  fontFamily?: string;
  newsTitle?: string;
  mediaFit?: 'contain' | 'cover';
  institutionNameColor?: string;
  institutionAddressColor?: string;
  clockColor?: string;
  clockStyle?: '3d' | 'classic';
  showSeconds?: boolean;
  dateColor?: string;
  newsTitleColor?: string;
  newsTextColor?: string;
  tickerTextColor?: string;
  showBorderAnimation?: boolean;
  logoUrl?: string;
  showLogo?: boolean;
  logoHeight?: number;
  beamColor?: string;
  beamSpeed?: number;
  beamShowHeaderInstansi?: boolean;
  beamShowHeaderClock?: boolean;
  beamShowMedia?: boolean;
  beamShowNews?: boolean;
  beamShowTicker?: boolean;
  enableQuillAnimation?: boolean;
  quillSpeed?: 'fast' | 'normal' | 'slow';
  quillReadingDuration?: number;
  audioDeviceId: string;
  globalImageDuration: number;
}
