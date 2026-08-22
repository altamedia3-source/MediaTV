
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { ScreenProvider, useScreenContext } from '../lib/ScreenContext';
import { defaultSettings } from '../db/db';
import { MediaItem, TextItem, AppSettings, TextType } from '../types';
import { Settings, Image as ImageIcon, Video, FileText, Check, X, UploadCloud, Type, Palette, Monitor, Play, Edit2, Trash2, Layout, Clock, Navigation, MousePointerClick, AlignLeft, AlignCenter, AlignRight, Type as TypeIcon, Hash, CheckSquare, Eye, ExternalLink, ImageUp, Plus, Newspaper, HardDrive } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

function DashboardContent() {
  const { screenId, data, loading, error, updateScreenData } = useScreenContext();
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'settings'>('media');
  
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Memuat Data Layar...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-red-500">Error: {error?.message}</p></div>;

  const mediaCount = data.media?.length || 0;
  const textCount = data.texts?.length || 0;

  return (
    <div className="h-screen bg-slate-950 font-sans text-slate-200 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar (Desktop) / Top Header & Bottom Nav (Mobile) */}
      
      {/* Mobile Top Header */}
      <div className="md:hidden shrink-0 p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-20">
        <div>
          <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-blue-400" /> MediaTV
          </h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ID: {screenId}</p>
        </div>
        <a href={`/display/${screenId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/30">
          <Play className="w-3.5 h-3.5" /> Buka TV
        </a>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex-col z-20">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-400" /> MediaTV
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Dashboard Layar: <span className="text-white uppercase">{screenId}</span></p>
          <a href={`/display/${screenId}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30">
            <Play className="w-4 h-4" /> Buka Layar TV
          </a>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('media')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'media' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Video className="w-4 h-4" /> Media & Video
            <span className="ml-auto bg-slate-800 text-xs py-0.5 px-2 rounded-full text-slate-300">{mediaCount}</span>
          </button>
          <button onClick={() => setActiveTab('text')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <FileText className="w-4 h-4" /> Teks & Berita
            <span className="ml-auto bg-slate-800 text-xs py-0.5 px-2 rounded-full text-slate-300">{textCount}</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
            <Settings className="w-4 h-4" /> Pengaturan TV
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'media' && <MediaManager data={data} updateScreenData={updateScreenData} />}
          {activeTab === 'text' && <TextManager data={data} updateScreenData={updateScreenData} />}
          {activeTab === 'settings' && <SettingsManager data={data} updateScreenData={updateScreenData} />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 pb-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('media')} className={`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all ${activeTab === 'media' ? 'text-blue-400' : 'text-slate-400'}`}>
          <Video className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Media</span>
        </button>
        <button onClick={() => setActiveTab('text')} className={`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all ${activeTab === 'text' ? 'text-blue-400' : 'text-slate-400'}`}>
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Teks</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}`}>
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Setelan</span>
        </button>
      </nav>
    </div>
  );
}

function MediaManager({ data, updateScreenData }: any) {
  const media = data.media || [];
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkType, setLinkType] = useState<'video'|'image'>('video');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isVideo = file.type.startsWith('video/');
    setLinkType(isVideo ? 'video' : 'image');
    if (!linkName) setLinkName(file.name.split('.')[0]);

    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `screens/${data.id || 'default'}/media/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("Upload error", error);
          setUploading(false);
          alert("Gagal mengunggah: " + error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setLinkUrl(downloadURL);
          setUploading(false);
        }
      );
    } catch (e: any) {
      setUploading(false);
      alert("Error: " + e.message);
    }
  };

  const handleAdd = async () => {
    if (!linkUrl) return;
    const newItem = {
      id: Date.now(),
      type: linkType,
      name: linkName || 'Media ' + (media.length + 1),
      externalUrl: linkUrl,
      duration: 10,
      order: media.length,
      active: true,
    };
    await updateScreenData({ media: [...media, newItem] });
    setLinkUrl('');
    setLinkName('');
  };

  const move = async (index: number, dir: 'up'|'down') => {
    if (dir === 'up' && index === 0) return;
    if (dir === 'down' && index === media.length - 1) return;
    const newList = [...media];
    const target = dir === 'up' ? index - 1 : index + 1;
    const temp = newList[index];
    newList[index] = newList[target];
    newList[target] = temp;
    await updateScreenData({ media: newList.map((m, i) => ({ ...m, order: i })) });
  };

  const remove = async (id: number) => {
    const newList = media.filter((m: any) => m.id !== id).map((m: any, i: number) => ({ ...m, order: i }));
    await updateScreenData({ media: newList });
  };

  const toggle = async (id: number, active: boolean) => {
    await updateScreenData({ media: media.map((m: any) => m.id === id ? { ...m, active } : m) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Video className="w-5 h-5 text-blue-400" /> Kelola Playlist Media</h2>
        <p className="text-sm text-slate-400 mb-6">Tambahkan link video atau gambar untuk ditampilkan bergiliran di layar TV.</p>
        
        <div className="flex flex-col md:flex-row gap-3 mb-2 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <select value={linkType} onChange={e => setLinkType(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500">
             <option value="video">Format Video</option>
             <option value="image">Format Gambar</option>
          </select>
          <input type="text" placeholder="Nama (Opsional)" value={linkName} onChange={e => setLinkName(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500" />
          <div className="flex-1 flex gap-2">
            <input type="url" placeholder="URL Media (http://... atau URL Lokal 192.168.x.x)" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 flex-1 outline-none focus:border-blue-500" />
            <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-3 rounded-lg cursor-pointer transition-colors flex items-center gap-2 border border-slate-700" title="Upload dari Komputer (tanpa XAMPP)">
              <UploadCloud className="w-5 h-5" />
              <input type="file" accept="video/*,image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <button onClick={handleAdd} disabled={!linkUrl || uploading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center min-w-[100px]">
            {uploading ? `${uploadProgress}%` : 'Tambah'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-6 italic px-1 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" /> <span>Pilih ikon Upload (awan) untuk unggah dari komputer, atau ketik manual URL file dari XAMPP/Python.</span></p>

        <div className="space-y-3">
          {media.length === 0 && <div className="text-center p-8 text-slate-500 italic bg-slate-950/30 rounded-xl border border-slate-800/50">Belum ada media. Tambahkan URL media di atas.</div>}
          {media.map((item: any, idx: number) => (
            <div key={item.id} className={`flex flex-col md:flex-row md:items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 transition-all ${!item.active ? 'opacity-50' : ''}`}>
              <div className="bg-blue-900/30 text-blue-400 font-black w-8 h-8 rounded-lg flex items-center justify-center shrink-0">{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold truncate flex items-center gap-2">
                  {item.type === 'video' ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />}
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 truncate mt-1">{item.externalUrl}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => move(idx, 'up')} disabled={idx === 0} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30">Naik</button>
                <button onClick={() => move(idx, 'down')} disabled={idx === media.length - 1} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-30">Turun</button>
                <button onClick={() => toggle(item.id, !item.active)} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${item.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{item.active ? 'Aktif' : 'Nonaktif'}</button>
                <button onClick={() => remove(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextManager({ data, updateScreenData }: any) {
  const texts = data.texts || [];
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'ticker'|'news'>('ticker');
  
  const handleAdd = async () => {
    if (!newText) return;
    const newItem = { id: Date.now(), type: newType, content: newText, active: true, order: texts.length };
    await updateScreenData({ texts: [...texts, newItem] });
    setNewText('');
  };

  const remove = async (id: number) => {
    await updateScreenData({ texts: texts.filter((t: any) => t.id !== id).map((t: any, i: number) => ({ ...t, order: i })) });
  };
  const toggle = async (id: number, active: boolean) => {
    await updateScreenData({ texts: texts.map((t: any) => t.id === id ? { ...t, active } : t) });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Kelola Teks & Berita</h2>
        
        <div className="flex gap-3 mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none">
            <option value="ticker">Ticker (Teks Berjalan)</option>
            <option value="news">Sidebar Berita</option>
          </select>
          <input type="text" placeholder="Isi Konten Teks..." value={newText} onChange={e => setNewText(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 flex-1 outline-none" />
          <button onClick={handleAdd} disabled={!newText} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg">Tambah</button>
        </div>

        <div className="space-y-3">
          {texts.map((item: any) => (
            <div key={item.id} className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
              <div className="flex-1 text-white text-sm font-medium">{item.content}</div>
              <div className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">{item.type === 'ticker' ? 'Ticker' : 'Berita'}</div>
              <button onClick={() => toggle(item.id, !item.active)} className={`px-3 py-1.5 text-xs font-bold rounded-lg ${item.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{item.active ? 'Aktif' : 'Nonaktif'}</button>
              <button onClick={() => remove(item.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsManager({ data, updateScreenData }: any) {
  const settings = data.settings || defaultSettings;
  const set = (key: string, val: any) => updateScreenData({ settings: { ...settings, [key]: val } });
  const [activeTab, setActiveTab] = useState<'umum' | 'tampilan' | 'warna' | 'animasi'>('umum');

  const presetColors = ['#ffffff', '#cbd5e1', '#94a3b8', '#38bdf8', '#0ea5e9', '#34d399', '#facc15', '#f87171', '#c084fc', '#f472b6'];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) set('logoUrl', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const ColorRow = ({ label, valueKey }: { label: string, valueKey: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      <div className="flex items-center gap-3">
        <input type="color" value={settings[valueKey] || '#ffffff'} onChange={e => set(valueKey, e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-slate-800 border-0" />
        <div className="flex gap-1.5">
          {presetColors.slice(0,6).map(c => (
            <button key={c} onClick={() => set(valueKey, c)} className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );

  const ToggleRow = ({ label, valueKey }: { label: string, valueKey: string }) => (
    <label className="flex items-center justify-between cursor-pointer p-4 bg-slate-900 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
      <span className="text-sm font-semibold text-white">{label}</span>
      <input type="checkbox" checked={settings[valueKey] !== false} onChange={e => set(valueKey, e.target.checked)} className="w-5 h-5 accent-blue-500" />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#111927] p-5 rounded-2xl border border-slate-800 shadow-md">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-blue-400" /> Pengaturan TV Lengkap
        </h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-900/80 rounded-xl border border-slate-800 w-fit">
          <button onClick={() => setActiveTab('umum')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'umum' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}`}>Umum & Header</button>
          <button onClick={() => setActiveTab('tampilan')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tampilan' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}`}>Tata Letak</button>
          <button onClick={() => setActiveTab('warna')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'warna' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}`}>Warna Teks</button>
          <button onClick={() => setActiveTab('animasi')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'animasi' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}`}>Animasi & Efek</button>
        </div>

        {/* Tab Content: Umum */}
        {activeTab === 'umum' && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Instansi</label>
                  <input type="text" value={settings.institutionName || ''} onChange={e => set('institutionName', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Instansi / Info</label>
                  <input type="text" value={settings.institutionAddress || ''} onChange={e => set('institutionAddress', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Baris Kop Tambahan 1 (Opsional)</label>
                  <input type="text" value={settings.headerLine1 || ''} onChange={e => set('headerLine1', e.target.value)} placeholder="Misal: DINAS PENDIDIKAN" className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Baris Kop Tambahan 2 (Opsional)</label>
                  <input type="text" value={settings.headerLine2 || ''} onChange={e => set('headerLine2', e.target.value)} placeholder="Misal: PEMERINTAH KABUPATEN BANYUMAS" className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Sidebar Berita</label>
                  <input type="text" value={settings.newsTitle || ''} onChange={e => set('newsTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Logo Instansi</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center p-2 shrink-0 overflow-hidden">
                      {settings.logoUrl ? <img src={settings.logoUrl} className="object-contain w-full h-full" alt="Logo" /> : <ImageUp className="w-8 h-8 text-slate-500" />}
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors text-sm font-semibold">
                        <UploadCloud className="w-4 h-4" /> Pilih Logo
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      <button onClick={() => set('logoUrl', '')} disabled={!settings.logoUrl} className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">Hapus Logo</button>
                    </div>
                  </div>
                  <div className="mt-4">
                     <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                       <input type="checkbox" checked={settings.showLogo !== false} onChange={e => set('showLogo', e.target.checked)} className="rounded bg-slate-800" />
                       Tampilkan Logo di Header
                     </label>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gaya Jam & Teks Kop</label>
                   <select value={settings.clockStyle || '3d'} onChange={e => set('clockStyle', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none text-sm mb-3">
                     <option value="3d">Jam 3D Digital</option>
                     <option value="classic">Jam Klasik Elegan</option>
                   </select>
                   <select value={settings.headerAlignment || 'center'} onChange={e => set('headerAlignment', e.target.value)} className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none text-sm">
                     <option value="left">Rata Kiri</option>
                     <option value="center">Rata Tengah</option>
                     <option value="right">Rata Kanan</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Tampilan */}
        {activeTab === 'tampilan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ToggleRow label="Tampilkan Ticker Bawah" valueKey="showTicker" />
            <ToggleRow label="Tampilkan Sidebar Berita" valueKey="showNews" />
            <ToggleRow label="Tampilkan Header Atas" valueKey="showHeader" />
            <ToggleRow label="Garis Pemisah Header" valueKey="showHeaderDivider" />
            
            <div className="md:col-span-2 p-4 bg-slate-900 rounded-xl border border-slate-800 mt-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Skala / Ukuran Media Video</label>
              <select value={settings.mediaFit || 'contain'} onChange={e => set('mediaFit', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500">
                <option value="contain">Contain (Terlihat Semua, ada ruang hitam)</option>
                <option value="cover">Cover (Penuh Layar, mungkin terpotong)</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Content: Warna */}
        {activeTab === 'warna' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ColorRow label="Warna Nama Instansi" valueKey="institutionNameColor" />
            <ColorRow label="Warna Alamat Instansi" valueKey="institutionAddressColor" />
            <ColorRow label="Warna Jam" valueKey="clockColor" />
            <ColorRow label="Warna Tanggal" valueKey="dateColor" />
            <ColorRow label="Warna Judul Berita" valueKey="newsTitleColor" />
            <ColorRow label="Warna Teks Berita" valueKey="newsTextColor" />
            <ColorRow label="Warna Teks Ticker" valueKey="tickerTextColor" />
            
            <div className="md:col-span-2 p-4 bg-slate-900 rounded-xl border border-slate-800 mt-2">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Warna Animasi Garis (Border Beam)</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.beamColor || '#38bdf8'} onChange={e => set('beamColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-slate-800 border-0" />
                <span className="text-xs text-slate-400">Garis berjalan yang mengelilingi kotak-kotak di TV</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Animasi */}
        {activeTab === 'animasi' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ToggleRow label="Aktifkan Animasi Ketik (Berita)" valueKey="enableQuillAnimation" />
            <ToggleRow label="Aktifkan Animasi Garis Tepi (Border Beam)" valueKey="showBorderAnimation" />
            
            {settings.showBorderAnimation !== false && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <label className="block text-sm font-semibold text-slate-300 mb-3 border-b border-slate-800 pb-2">Posisi Animasi Garis (Border Beam)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ToggleRow label="Kotak Area Video" valueKey="beamShowMedia" />
                  <ToggleRow label="Kotak Sidebar Berita" valueKey="beamShowNews" />
                  <ToggleRow label="Kotak Teks Berjalan" valueKey="beamShowTicker" />
                  <ToggleRow label="Kotak Header (Info Instansi)" valueKey="beamShowHeaderInstansi" />
                  <ToggleRow label="Kotak Header (Jam)" valueKey="beamShowHeaderClock" />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800">
                   <label className="block text-sm font-semibold text-slate-300 mb-2">Kecepatan Putaran Garis (Detik)</label>
                   <input type="number" min="2" max="20" value={settings.beamSpeed || 6} onChange={e => set('beamSpeed', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>
            )}
            
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Kecepatan Teks Berita (Detik per baris)</label>
                <input type="number" min="2" max="20" value={settings.quillReadingDuration || 6} onChange={e => set('quillReadingDuration', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Kecepatan Ketik Karakter</label>
                <select value={settings.quillSpeed || 'normal'} onChange={e => set('quillSpeed', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500">
                  <option value="fast">Cepat</option>
                  <option value="normal">Normal</option>
                  <option value="slow">Lambat</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


export default function Dashboard() {
  const { screenId } = useParams();
  return <ScreenProvider screenId={screenId!}><DashboardContent /></ScreenProvider>;
}
