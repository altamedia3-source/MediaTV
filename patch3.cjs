const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Remove the wrongly placed TextManager declaration
content = content.replace(/\n\} \/\/ close MediaManager\n\nfunction TextManager\(\) \{\n[\s\S]*?const tickerCount/g, "  const tickerCount");

// Insert TextManager at the correct place
const textManagerStart = `
  return (
    <div className="space-y-6">
      <div className="bg-[#111927] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">Kelola Playlist Media (Video & Gambar)</h2>
        
        {/* URL Input */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 p-4 bg-slate-900 rounded-xl">
          <select value={linkType} onChange={e => setLinkType(e.target.value as 'video'|'image')} className="bg-slate-800 text-white rounded p-2 text-sm outline-none">
            <option value="video">Video</option><option value="image">Gambar</option>
          </select>
          <input type="text" placeholder="Nama Tampilan" value={linkName} onChange={e => setLinkName(e.target.value)} className="bg-slate-800 text-white rounded p-2 text-sm flex-1 outline-none" />
          <input type="url" placeholder="URL Media Lengkap" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="bg-slate-800 text-white rounded p-2 text-sm flex-1 outline-none" />
          <button onClick={handleAddLink} disabled={!linkUrl} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded">Tambah</button>
        </div>

        {/* Media List */}
        <div className="space-y-3">
          {media.map((item, index) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="text-blue-400 font-bold px-2">{index + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.externalUrl}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => moveMedia(index, 'up')} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded">Naik</button>
                <button onClick={() => moveMedia(index, 'down')} className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-2 py-1 rounded">Turun</button>
                <button onClick={() => toggleActive(item.id!, !item.active)} className={item.active ? "bg-emerald-900/50 text-emerald-400 text-xs px-2 py-1 rounded" : "bg-slate-800 text-slate-500 text-xs px-2 py-1 rounded"}>{item.active ? "Aktif" : "Non-aktif"}</button>
                <button onClick={() => deleteMedia(item.id!)} className="bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs px-2 py-1 rounded">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextManager() {
  const { data, updateScreenData } = useScreenContext();
  const texts = data?.texts || [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [newType, setNewType] = useState<'ticker' | 'news'>('ticker');
  const [newText, setNewText] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'all' | 'ticker' | 'news'>('all');

  const addText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newText.trim()) return;
    const currentCount = texts.length;
    const newItem = {
      id: Date.now(),
      type: newType,
      content: newText.trim(),
      active: true,
      order: currentCount,
    };
    await updateScreenData({ texts: [...texts, newItem] });
    setNewText('');
  };
`;

content = content.replace(/  const toggleActiveText = async/g, textManagerStart + "\n  const toggleActiveText = async");

// Fix Display.tsx error `Cannot find name 'loadData'`
// In Display.tsx, there are calls to loadData() that were left over from Dexie!
// I'll run a sed on Display.tsx to remove `loadData();` inside useEffects.

fs.writeFileSync('src/pages/Dashboard.tsx', content);

let displayContent = fs.readFileSync('src/pages/Display.tsx', 'utf8');
displayContent = displayContent.replace(/loadData\(\);/g, '');
fs.writeFileSync('src/pages/Display.tsx', displayContent);

// Fix updateScreenData missing in SettingsManager
let settingsManagerFix = `function SettingsManager() {
  const { data, updateScreenData } = useScreenContext();
  const settings = data?.settings || defaultSettings;
`;
content = content.replace(/function SettingsManager\(\) \{[\s\S]*?const settings = data\?\.settings;/g, settingsManagerFix);
fs.writeFileSync('src/pages/Dashboard.tsx', content);
