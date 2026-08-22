const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const replacement = `<ToggleRow label="Aktifkan Animasi Garis Tepi (Border Beam)" valueKey="showBorderAnimation" />
            
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
            )}`;

content = content.replace(/<ToggleRow label="Aktifkan Animasi Garis Tepi \(Border Beam\)" valueKey="showBorderAnimation" \/>/, replacement);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
