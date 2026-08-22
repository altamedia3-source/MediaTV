import Dexie, { type EntityTable } from 'dexie';
import { MediaItem, TextItem, AppSettings } from '../types';

const db = new Dexie('MediaTVDatabase') as Dexie & {
  media: EntityTable<MediaItem, 'id'>;
  texts: EntityTable<TextItem, 'id'>;
  settings: EntityTable<AppSettings, 'id'>;
};

db.version(1).stores({
  media: '++id, type, name, order, active',
  texts: '++id, type, active, order',
  settings: 'id'
});

export const defaultSettings: AppSettings = {
  id: 1,
  showVideo: true,
  showImage: true,
  showTicker: true,
  showNews: true,
  showHeader: true,
  headerLine1: '',
  headerLine2: '',
  institutionName: 'NAMA INSTANSI DISINI',
  institutionAddress: 'Alamat instansi disini',
  showHeaderDivider: false,
  headerAlignment: 'center',
  fontFamily: 'sans',
  newsTitle: 'BERITA TERKINI',
  mediaFit: 'contain',
  institutionNameColor: '#ffffff',
  institutionAddressColor: '#cbd5e1',
  clockColor: '#ffffff',
  clockStyle: '3d',
  showSeconds: false,
  dateColor: '#cbd5e1',
  newsTitleColor: '#ffffff',
  newsTextColor: '#e2e8f0',
  tickerTextColor: '#ffffff',
  showBorderAnimation: true,
  logoUrl: '',
  showLogo: true,
  logoHeight: 52,
  beamColor: '#38bdf8',
  beamSpeed: 6,
  beamShowHeaderInstansi: true,
  beamShowHeaderClock: true,
  beamShowMedia: true,
  beamShowNews: true,
  beamShowTicker: true,
  enableQuillAnimation: true,
  quillSpeed: 'normal',
  quillReadingDuration: 6,
  audioDeviceId: '',
  globalImageDuration: 10,
};

export { db };
