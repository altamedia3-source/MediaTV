import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { ScreenProvider, useScreenContext } from '../lib/ScreenContext';
import { defaultSettings } from '../db/db';
import { MediaItem, TextItem, AppSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize, Play, Monitor, Settings as SettingsIcon, Volume2, X } from 'lucide-react';
import { AnimatedBorderBeam } from '../components/AnimatedBorderBeam';
import { SelfWritingNews } from '../components/SelfWritingNews';
import { Clock3D } from '../components/Clock3D';
import { MagicTicker } from '../components/MagicTicker';

function DisplayContent() {
  const { data, loading, error } = useScreenContext();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [tickerTexts, setTickerTexts] = useState<TextItem[]>([]);
  const [newsTexts, setNewsTexts] = useState<TextItem[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const [time, setTime] = useState(new Date());

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Initial Data
  useEffect(() => {
    document.title = 'MediaTV - Layar Display TV';
    
    // Get audio output devices
    const getDevices = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
        // Request minimal permission to get labels if needed (usually enumerate is enough, but some browsers hide labels)
        try { await navigator.mediaDevices.getUserMedia({ audio: true }); } catch(e) {}
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        setAudioDevices(audioOutputs);
      } catch (err) {
        console.error("Error getting devices", err);
      }
    };
    getDevices();
    navigator.mediaDevices?.addEventListener('devicechange', getDevices);

    // Listen for BroadcastChannel updates from Admin
    const bc = new BroadcastChannel('mediatv_channel');
    bc.onmessage = (event) => {
      console.log('Received broadcast:', event.data);
      if (event.data.type === 'UPDATE_PLAYLIST' || event.data.type === 'UPDATE_TEXT' || event.data.type === 'UPDATE_SETTINGS') {
        
      }
    };

    // Clock
    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      bc.close();
      clearInterval(timer);
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, []);

  // Data is loaded from context automatically
  useEffect(() => {
    if (data) {
      setSettings(data.settings || defaultSettings);
      setMediaList(data.media?.filter(m => m.active).sort((a, b) => a.order - b.order) || []);
      const texts = data.texts?.filter(t => t.active).sort((a, b) => a.order - b.order) || [];
      setTickerTexts(texts.filter(t => t.type === 'ticker'));
      setNewsTexts(texts.filter(t => t.type === 'news'));
    }
  }, [data]);

  // Main playback logic
  useEffect(() => {
    if (!isPlaying) return;
    if (mediaList.length === 0) {
      setCurrentMediaUrl('');
      return;
    }

    let urlToRevoke = currentMediaUrl;

    const playNext = async () => {
      let nextIndex = currentIndex;
      if (nextIndex >= mediaList.length) {
        nextIndex = 0; // Loop back
      }

      const media = mediaList[nextIndex];
      
      // Filter out media types not allowed by settings
      const isVideoType = media.type === 'video';
      if ((isVideoType && !settings.showVideo) || (media.type === 'image' && !settings.showImage)) {
        // Skip this one and try the next
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
        return;
      }

      let url = '';
      if (media.blob) {
        url = URL.createObjectURL(media.blob);
      } else if (media.externalUrl) {
        url = media.externalUrl;
      }
      setCurrentMediaUrl(url);

      if (media.type === 'image') {
        // Schedule next play
        if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
        imageTimerRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % mediaList.length);
        }, media.duration * 1000);
      }
    };

    playNext();

    // Cleanup when currentIndex changes or we stop playing
    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
      if (urlToRevoke && urlToRevoke.startsWith('blob:')) URL.revokeObjectURL(urlToRevoke);
    };
  }, [currentIndex, isPlaying, mediaList, settings.showVideo, settings.showImage]);


  // Update Audio Output Device when settings change
  useEffect(() => {
    if (videoRef.current && selectedAudioDevice && typeof (videoRef.current as any).setSinkId === 'function') {
      (videoRef.current as any).setSinkId(selectedAudioDevice).catch((err: any) => {
        console.error('Error setting audio output device:', err);
      });
    }
  }, [selectedAudioDevice, currentMediaUrl]);

  const startDisplay = () => {
    setNeedsInteraction(false);
    setIsPlaying(true);
    document.documentElement.requestFullscreen().catch(err => console.log(err));
  };

  const currentMedia = mediaList[currentIndex % mediaList.length];
  const isCurrentVideoType = currentMedia?.type === 'video';

  if (needsInteraction) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center text-white">
        <div className="text-center p-8 bg-slate-800 rounded-2xl max-w-md shadow-2xl">
          <Monitor className="w-20 h-20 mx-auto text-indigo-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">MediaTV Display Siap</h1>
          <p className="text-slate-400 mb-8">Geser jendela ini ke layar ke-2 (TV), lalu klik tombol di bawah ini untuk memulai dalam mode Fullscreen.</p>
          <button
            onClick={startDisplay}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            <Play className="w-6 h-6" /> Mulai Tampilan
          </button>
        </div>
      </div>
    );
  }

  const showMedia = currentMedia && (
    (isCurrentVideoType && settings.showVideo) ||
    (currentMedia.type === 'image' && settings.showImage)
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ' : ');
  };
  
  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[date.getDay()];
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${dayName}, ${d} / ${m} / ${y}`;
  };

  const getFontClass = (font?: string) => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case 'center': return 'items-center text-center';
      case 'right': return 'items-end text-right';
      default: return 'items-start text-left';
    }
  };

  return (
    <div className={`flex flex-col h-screen bg-[#020817] overflow-hidden ${getFontClass(settings.fontFamily)}`}>
      
      {/* Header Info */}
      {settings.showHeader && (
        <div className="flex gap-3 p-3 shrink-0">
          <div className="flex-1 bg-[#0b1426] rounded-xl border border-blue-900/50 p-4 flex items-center gap-5 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {settings.showBorderAnimation !== false && settings.beamShowHeaderInstansi !== false && (
              <AnimatedBorderBeam 
                color={settings.beamColor || '#38bdf8'} 
                duration={settings.beamSpeed || 6} 
                delay={0}
                beamCount={1}
              />
            )}
            {/* Institute Logo (if enabled and set) */}
            {settings.showLogo !== false && settings.logoUrl && (
              <div className="shrink-0 z-10 flex items-center justify-center">
                <img 
                  key={settings.logoUrl.slice(0, 30)}
                  src={settings.logoUrl} 
                  alt="Logo Instansi" 
                  className="object-contain drop-shadow-[0_0_14px_rgba(56,189,248,0.35)] transition-all duration-300"
                  style={{ 
                    height: `${settings.logoHeight || 70}px`,
                    maxHeight: '96px',
                    maxWidth: '150px',
                  }}
                />
              </div>
            )}
            <div className={`flex flex-col justify-center flex-1 z-10 ${getAlignmentClass(settings.headerAlignment)}`}>
              {/* Baris 1: Instansi Induk / Pemerintah / Dinas (opsional) */}
              {settings.headerLine1 && (
                <div 
                  className="font-bold text-sm md:text-base tracking-widest uppercase leading-tight text-slate-200"
                  style={{ textShadow: '0 0 8px rgba(56, 189, 248, 0.2)' }}
                >
                  {settings.headerLine1}
                </div>
              )}
              {/* Baris 2: Sub-Unit / Wilayah / Cabang (opsional) */}
              {settings.headerLine2 && (
                <div className="font-semibold text-xs md:text-sm tracking-wider uppercase leading-tight text-slate-300">
                  {settings.headerLine2}
                </div>
              )}
              {/* Baris 3: Nama Instansi Utama */}
              <h1 
                className="font-extrabold text-2xl md:text-3xl tracking-wide uppercase leading-tight py-0.5"
                style={{ color: settings.institutionNameColor || '#ffffff' }}
              >
                {settings.institutionName}
              </h1>
              {/* Baris 4: Alamat Lengkap & Kontak */}
              {settings.institutionAddress && (
                <p 
                  className="text-xs md:text-sm font-normal text-slate-300 leading-snug"
                  style={{ color: settings.institutionAddressColor || '#cbd5e1' }}
                >
                  {settings.institutionAddress}
                </p>
              )}

              {/* Garis Kop Surat Resmi (jika diaktifkan) */}
              {settings.showHeaderDivider && (
                <div className="w-full pt-1.5 flex flex-col gap-0.5 pointer-events-none opacity-80">
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
                </div>
              )}
            </div>
            {/* Balance spacing if center aligned and logo exists */}
            {settings.headerAlignment === 'center' && settings.showLogo !== false && settings.logoUrl && (
              <div 
                className="shrink-0 pointer-events-none hidden sm:block" 
                style={{ width: `${settings.logoHeight || 70}px` }} 
              />
            )}
          </div>
          <div className="w-[350px] shrink-0 bg-[#0b1426] rounded-xl border border-blue-900/50 p-3 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {settings.showBorderAnimation !== false && settings.beamShowHeaderClock !== false && (
              <AnimatedBorderBeam 
                color={settings.beamColor || '#38bdf8'} 
                duration={(settings.beamSpeed || 6) * 0.9} 
                delay={1.5}
                beamCount={1}
              />
            )}
            {settings.clockStyle !== 'classic' ? (
              <div className="z-10 flex flex-col items-center py-0.5">
                <Clock3D 
                  time={time} 
                  color={settings.clockColor || '#ffffff'} 
                  showSeconds={!!settings.showSeconds}
                />
              </div>
            ) : (
              <div 
                className="font-bold text-4xl tracking-widest leading-none drop-shadow-md z-10"
                style={{ color: settings.clockColor || '#ffffff' }}
              >
                {formatTime(time)}
              </div>
            )}
            <div 
              className="text-sm mt-1.5 font-medium tracking-wide z-10 text-center uppercase"
              style={{ color: settings.dateColor || '#cbd5e1' }}
            >
              {formatDate(time)}
            </div>
          </div>
        </div>
      )}

      {/* Middle Section (Media + Sidebar) */}
      <div className="flex-1 flex gap-3 px-3 pb-3 overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 relative bg-black rounded-xl border border-blue-900/50 overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {settings.showBorderAnimation !== false && settings.beamShowMedia !== false && (
            <AnimatedBorderBeam 
              color={settings.beamColor || '#38bdf8'} 
              duration={(settings.beamSpeed || 6) * 1.5} 
              delay={0.5}
              beamCount={2}
            />
          )}
          <AnimatePresence mode="wait">
            {showMedia && isCurrentVideoType && (
              <motion.div
                key={`video-${currentMediaUrl}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full absolute inset-0 flex items-center justify-center bg-black"
              >
                <video
                  ref={videoRef}
                  src={currentMediaUrl}
                  autoPlay
                  playsInline
                  className={`w-full h-full ${settings.mediaFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                  onEnded={() => {
                    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
                  }}
                  onError={(e) => {
                    console.error("Video error:", e);
                    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
                  }}
                  onCanPlay={(e) => {
                    const videoElement = e.target as HTMLVideoElement;
                    videoElement.play().catch(err => console.error("Autoplay prevented:", err));
                  }}
                />
              </motion.div>
            )}

            {showMedia && currentMedia.type === 'image' && (
              <motion.img
                key={`image-${currentMediaUrl}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={currentMediaUrl}
                className={`w-full h-full ${settings.mediaFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                alt="Display Media"
              />
            )}
          </AnimatePresence>

          {!showMedia && mediaList.length > 0 && (
            <div className="text-slate-500 text-2xl">Media dimatikan di pengaturan</div>
          )}
          
          {mediaList.length === 0 && (
            <div className="text-slate-500 text-2xl">Belum ada media yang aktif</div>
          )}
        </div>

        {/* Right Sidebar (News) */}
        {settings.showNews && (
          <div className="w-[350px] shrink-0 bg-[#0b1426] rounded-xl border border-blue-900/50 p-6 flex flex-col overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] relative">
            {settings.showBorderAnimation !== false && settings.beamShowNews !== false && (
              <AnimatedBorderBeam 
                color={settings.beamColor || '#38bdf8'} 
                duration={(settings.beamSpeed || 6) * 1.2} 
                delay={2.5}
                beamCount={1}
              />
            )}
            <h3 
              className="font-bold text-xl mb-4 tracking-wider uppercase flex items-center gap-3 shrink-0 border-b border-blue-800/50 pb-3 z-10"
              style={{ color: settings.newsTitleColor || '#ffffff' }}
            >
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
              {settings.newsTitle || 'Berita Terkini'}
            </h3>
            <div className="flex-1 overflow-hidden z-10">
              <SelfWritingNews 
                newsList={newsTexts}
                textColor={settings.newsTextColor || '#e2e8f0'}
                speed={settings.quillSpeed || 'normal'}
                readingDuration={settings.quillReadingDuration || 6}
                enableAnimation={settings.enableQuillAnimation !== false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Ticker Bottom Bar */}
      {settings.showTicker && tickerTexts.length > 0 && (
        <div className="px-3 pb-3 shrink-0">
          <div className="h-16 bg-[#0b1426] text-white flex items-center relative overflow-hidden shrink-0 border border-blue-900/50 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {settings.showBorderAnimation !== false && settings.beamShowTicker !== false && (
              <AnimatedBorderBeam 
                color={settings.beamColor || '#38bdf8'} 
                duration={(settings.beamSpeed || 6) * 1.1} 
                delay={3.5}
                beamCount={1}
              />
            )}
            <div className="bg-gradient-to-r from-red-600 via-red-600 to-rose-600 h-full flex items-center px-6 font-bold text-xl uppercase tracking-widest z-10 shadow-[5px_0_15px_rgba(0,0,0,0.5)] border-r border-red-400/30">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shadow-[0_0_8px_#ffffff]" />
                INFO
              </span>
            </div>
            <MagicTicker 
              tickerTexts={tickerTexts}
              textColor={settings.tickerTextColor || '#ffffff'}
            />
          </div>
        </div>
      )}

      {/* Floating Audio Settings Button */}
      <button 
        onClick={() => setShowAudioSettings(true)}
        className="fixed bottom-4 right-4 p-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full opacity-0 hover:opacity-100 transition-opacity z-50 backdrop-blur-sm"
        title="Pengaturan Audio Output"
      >
        <Volume2 className="w-5 h-5" />
      </button>

      {/* Audio Settings Modal */}
      {showAudioSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAudioSettings(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-400" /> Pengaturan Audio TV
            </h2>
            <p className="text-sm text-slate-400 mb-6">Pilih perangkat output suara untuk video yang diputar di layar ini. Berguna jika Anda menggunakan 2 layar pada 1 komputer.</p>
            
            <div className="space-y-4">
              {audioDevices.length === 0 ? (
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-sm text-slate-300">
                  Browser tidak mendeteksi perangkat output audio atau belum diberi izin. 
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Speaker / Output Audio:</label>
                  <select 
                    value={selectedAudioDevice} 
                    onChange={e => setSelectedAudioDevice(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500"
                  >
                    <option value="">Default System</option>
                    {audioDevices.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker ${device.deviceId.slice(0,5)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <button onClick={() => setShowAudioSettings(false)} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all">
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

function MonitorIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export default function Display() {
  const { screenId } = useParams();
  return <ScreenProvider screenId={screenId!}><DisplayContent /></ScreenProvider>;
}
