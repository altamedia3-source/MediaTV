const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Structure changes
// Let's replace the whole DashboardContent return block.
const replacement = `  return (
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
        <a href={\`/display/\${screenId}\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/30">
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
          <a href={\`/display/\${screenId}\`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30">
            <Play className="w-4 h-4" /> Buka Layar TV
          </a>
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
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'media' && <MediaManager data={data} updateScreenData={updateScreenData} />}
          {activeTab === 'text' && <TextManager data={data} updateScreenData={updateScreenData} />}
          {activeTab === 'settings' && <SettingsManager data={data} updateScreenData={updateScreenData} />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 pb-safe z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('media')} className={\`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all \${activeTab === 'media' ? 'text-blue-400' : 'text-slate-400'}\`}>
          <Video className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Media</span>
        </button>
        <button onClick={() => setActiveTab('text')} className={\`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all \${activeTab === 'text' ? 'text-blue-400' : 'text-slate-400'}\`}>
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Teks</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={\`flex flex-col items-center p-2 rounded-lg min-w-[72px] transition-all \${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400'}\`}>
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold">Setelan</span>
        </button>
      </nav>
    </div>
  );
}`;

content = content.replace(/  return \([\s\S]*?    <\/div>\n  \);\n\}/, replacement + '\n}');

fs.writeFileSync('src/pages/Dashboard.tsx', content);
