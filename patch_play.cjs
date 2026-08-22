const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const replacement = `<p className="text-xs text-slate-400 font-medium mt-1">Dashboard Layar: <span className="text-white uppercase">{screenId}</span></p>
            <a href={\`/display/\${screenId}\`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/30">
              <Play className="w-4 h-4" /> Buka Layar TV
            </a>`;

content = content.replace(/<p className="text-xs text-slate-400 font-medium mt-1">Dashboard Layar: <span className="text-white uppercase">\{screenId\}<\/span><\/p>/, replacement);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
