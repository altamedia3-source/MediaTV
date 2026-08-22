const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Insert TextManager state variables right above tickerCount
const textManagerStart = `
} // close MediaManager

function TextManager() {
  const { data, updateScreenData } = useScreenContext();
  const texts = data?.texts || [];
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [newType, setNewType] = useState<'ticker' | 'news'>('ticker');
  const [newText, setNewText] = useState('');

  const addText = async (e: React.FormEvent) => {
    e.preventDefault();
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
content = content.replace(/  const tickerCount = texts\?\.filter/g, textManagerStart + "\n  const tickerCount = texts?.filter");

// We also need a return for MediaManager!
// Where should the return for MediaManager be? Right before `} // close MediaManager`
const mediaManagerReturn = `
  return (
    <div className="space-y-6">
      <div className="bg-[#111927] p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4">Kelola Playlist Media (Video & Gambar)</h2>
        
        {/* URL Input */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 p-4 bg-slate-900 rounded-xl">
          <select value={linkType} onChange={e => setLinkType(e.target.value as 'video'|'image')} className="bg-slate-800 text-white rounded p-2">
            <option value="video">Video</option><option value="image">Gambar</option>
          </select>
          <input type="text" placeholder="Nama (Opsional)" value={linkName} onChange={e => setLinkName(e.target.value)} className="bg-slate-800 text-white rounded p-2" />
          <input type="url" placeholder="URL Media" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} className="bg-slate-800 text-white rounded p-2 flex-1" />
          <button onClick={handleAddLink} disabled={!linkUrl} className="bg-blue-600 text-white px-4 py-2 rounded">Tambah via URL</button>
        </div>

        {/* Media List */}
        <div className="space-y-3">
          {media.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-white font-bold">{index + 1}</div>
              <div className="flex-1 text-white">
                <div>{item.name}</div>
                <div className="text-xs text-slate-400">{item.externalUrl}</div>
              </div>
              <button onClick={() => moveMedia(index, 'up')} className="text-slate-400 hover:text-white">Naik</button>
              <button onClick={() => moveMedia(index, 'down')} className="text-slate-400 hover:text-white">Turun</button>
              <button onClick={() => toggleActive(item.id!, !item.active)} className={item.active ? "text-blue-400" : "text-slate-500"}>{item.active ? "Aktif" : "Non-aktif"}</button>
              <button onClick={() => deleteMedia(item.id!)} className="text-red-400">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
`;
content = content.replace(/} \/\/ close MediaManager/g, mediaManagerReturn + "\n} // close MediaManager");

// Now we need to fix the addText references in TextManager JSX
content = content.replace(/onSubmit=\{handleAddText\}/g, 'onSubmit={addText}');
content = content.replace(/onChange={\(e\) => setNewTextContent\(e.target.value\)}/g, 'onChange={(e) => setNewText(e.target.value)}');
content = content.replace(/value=\{newTextContent\}/g, 'value={newText}');

// We also need to fix `selectedSubTab` which was used in TextManager.
const subTabState = `  const [selectedSubTab, setSelectedSubTab] = useState<'all' | 'ticker' | 'news'>('all');\n`;
content = content.replace(/const \[newType, setNewType\]/g, subTabState + "  const [newType, setNewType]");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
