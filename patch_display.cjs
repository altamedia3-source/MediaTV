const fs = require('fs');
let content = fs.readFileSync('src/pages/Display.tsx', 'utf8');

content = content.replace(/import \{ db, defaultSettings \} from '\.\.\/db\/db';/,
`import { useParams } from 'react-router';
import { ScreenProvider, useScreenContext } from '../lib/ScreenContext';
import { defaultSettings } from '../db/db';`);

content = content.replace(/export default function Display\(\) \{/,
`function DisplayContent() {
  const { data, loading, error } = useScreenContext();`);

content = content.replace(/const loadData = async \(\) => \{[\s\S]*?setNewsTexts\(texts\.filter\(t => t\.type === 'news'\)\);\n  \};/g,
`// Data is loaded from context automatically
  useEffect(() => {
    if (data) {
      setSettings(data.settings || defaultSettings);
      setMediaList(data.media?.filter(m => m.active).sort((a, b) => a.order - b.order) || []);
      const texts = data.texts?.filter(t => t.active).sort((a, b) => a.order - b.order) || [];
      setTickerTexts(texts.filter(t => t.type === 'ticker'));
      setNewsTexts(texts.filter(t => t.type === 'news'));
    }
  }, [data]);`);

content = content.replace(/useEffect\(\(\) => \{\n    loadData\(\);[\s\S]*?bc\.close\(\);\n    \};\n  \}, \[\]\);/g,
`// Realtime sync is handled by useScreenContext, no BroadcastChannel needed.`);

content = content.replace(/if \(!isPlaying\) \{[\s\S]*?<\/div>\n      \)\;\n    \}/,
`if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Memuat Tampilan Layar...</p></div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-red-500">Error: {error.message}</p></div>;

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <button 
          onClick={handleStart}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105"
        >
          <Play className="w-8 h-8" />
          Mulai Tampilkan Layar TV
        </button>
      </div>
    );
  }`);

content += `\nexport default function Display() {\n  const { screenId } = useParams();\n  return <ScreenProvider screenId={screenId!}><DisplayContent /></ScreenProvider>;\n}\n`;

fs.writeFileSync('src/pages/Display.tsx', content);
