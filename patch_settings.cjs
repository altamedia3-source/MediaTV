const fs = require('fs');

const content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// We are going to replace SettingsManager with a full-featured version.

const settingsManagerReplacement = `function SettingsManager({ data, updateScreenData }: any) {
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
          <button onClick={() => setActiveTab('umum')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${activeTab === 'umum' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}\`}>Umum & Header</button>
          <button onClick={() => setActiveTab('tampilan')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${activeTab === 'tampilan' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}\`}>Tata Letak</button>
          <button onClick={() => setActiveTab('warna')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${activeTab === 'warna' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}\`}>Warna Teks</button>
          <button onClick={() => setActiveTab('animasi')} className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${activeTab === 'animasi' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:text-white'}\`}>Animasi & Efek</button>
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
`;

const updatedContent = content.replace(/function SettingsManager.*?\{[\s\S]*?\}\n\nexport default function Dashboard/m, settingsManagerReplacement + '\n\nexport default function Dashboard');

fs.writeFileSync('src/pages/Dashboard.tsx', updatedContent);
