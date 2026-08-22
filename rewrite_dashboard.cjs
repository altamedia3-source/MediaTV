const fs = require('fs');

const content = `
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { ScreenProvider, useScreenContext } from '../lib/ScreenContext';
import { defaultSettings } from '../db/db';
import { MediaItem, TextItem, AppSettings, TextType } from '../types';
import { Settings, Image as ImageIcon, Video, FileText, Check, X, UploadCloud, Type, Palette, Monitor, Play, Edit2, Trash2, Layout, Clock, Navigation, MousePointerClick, AlignLeft, AlignCenter, AlignRight, Type as TypeIcon, Hash, CheckSquare, Eye, ExternalLink, ImageUp, Plus, Newspaper } from 'lucide-react';

function DashboardContent() {
  const { screenId, data, loading, error, updateScreenData } = useScreenContext();
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'settings'>('media');
  
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Memuat Data Layar...</p></div>;
  if (error || !data) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-red-500">Error: {error?.message}</p></div>;

  const mediaCount = data.media?.length || 0;
  const textCount = data.texts?.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
          <div className="p-5 border-b border-slate-800">
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-400" />
              MediaTV
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Dashboard Layar: <span className="text-white uppercase">{screenId}</span></p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button onClick={() => setActiveTab('media')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all \${activeTab === 'media' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}\`}>
              <Video className="w-4 h-4" /> Media & Video
              <span className="ml-auto bg-slate-800 text-xs py-0.5 px-2 rounded-full text-slate-300">{mediaCount}</span>
            </button>
            <button onClick={() => setActiveTab('text')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all \${activeTab === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}\`}>
              <FileText className="w-4 h-4" /> Teks & Berita
              <span className="ml-auto bg-slate-800 text-xs py-0.5 px-2 rounded-full text-slate-300">{textCount}</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all \${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}\`}>
              <Settings className="w-4 h-4" /> Pengaturan TV
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'media' && <MediaManager data={data} updateScreenData={updateScreenData} />}
            {activeTab === 'text' && <TextManager data={data} updateScreenData={updateScreenData} />}
            {activeTab === 'settings' && <SettingsManager data={data} updateScreenData={updateScreenData} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function MediaManager({ data, updateScreenData }: any) {
  const media = data.media || [];
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkType, setLinkType] = useState<'video'|'image'>('video');

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
        
        <div className="flex flex-col md:flex-row gap-3 mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <select value={linkType} onChange={e => setLinkType(e.target.value as any)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500">
            <option value="video">Format Video</option>
            <option value="image">Format Gambar</option>
          </select>
          <input type="text" placeholder="Nama (Opsional)" value={linkName} onChange={e => setLinkName(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-blue-500" />
          <input type="url" placeholder="URL Lengkap (http://...)" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg p-3 flex-1 outline-none focus:border-blue-500" />
          <button onClick={handleAdd} disabled={!linkUrl} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-lg transition-all">Tambah</button>
        </div>

        <div className="space-y-3">
          {media.length === 0 && <div className="text-center p-8 text-slate-500 italic bg-slate-950/30 rounded-xl border border-slate-800/50">Belum ada media. Tambahkan URL media di atas.</div>}
          {media.map((item: any, idx: number) => (
            <div key={item.id} className={\`flex flex-col md:flex-row md:items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 transition-all \${!item.active ? 'opacity-50' : ''}\`}>
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
                <button onClick={() => toggle(item.id, !item.active)} className={\`px-3 py-1.5 text-xs font-bold rounded-lg \${item.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}\`}>{item.active ? 'Aktif' : 'Nonaktif'}</button>
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
              <button onClick={() => toggle(item.id, !item.active)} className={\`px-3 py-1.5 text-xs font-bold rounded-lg \${item.active ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-400'}\`}>{item.active ? 'Aktif' : 'Nonaktif'}</button>
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

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-blue-400" /> Pengaturan Tampilan</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Nama Instansi</label>
            <input type="text" value={settings.institutionName || ''} onChange={e => set('institutionName', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Alamat Instansi</label>
            <input type="text" value={settings.institutionAddress || ''} onChange={e => set('institutionAddress', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Judul Berita Sidebar</label>
            <input type="text" value={settings.newsTitle || ''} onChange={e => set('newsTitle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
            <input type="checkbox" checked={settings.showNews !== false} onChange={e => set('showNews', e.target.checked)} className="w-5 h-5 accent-blue-500" />
            <span className="text-sm font-semibold text-white">Tampilkan Berita Sidebar</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
            <input type="checkbox" checked={settings.showTicker !== false} onChange={e => set('showTicker', e.target.checked)} className="w-5 h-5 accent-blue-500" />
            <span className="text-sm font-semibold text-white">Tampilkan Ticker Bawah</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
            <input type="checkbox" checked={settings.showHeader !== false} onChange={e => set('showHeader', e.target.checked)} className="w-5 h-5 accent-blue-500" />
            <span className="text-sm font-semibold text-white">Tampilkan Header Atas</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { screenId } = useParams();
  return <ScreenProvider screenId={screenId!}><DashboardContent /></ScreenProvider>;
}
`;
fs.writeFileSync('src/pages/Dashboard.tsx', content);
