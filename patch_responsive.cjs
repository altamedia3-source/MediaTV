const fs = require('fs');

let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// 1. Fix the main container flex direction
content = content.replace(/<div className="flex h-screen overflow-hidden">/, '<div className="flex flex-col md:flex-row h-screen overflow-hidden">');

// 2. Fix the aside styles
content = content.replace(/<aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">/, '<aside className="w-full md:w-64 shrink-0 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col z-20">');

// 3. Adjust the nav to be horizontal on mobile, vertical on desktop
content = content.replace(/<nav className="flex-1 p-4 space-y-2 overflow-y-auto">/, '<nav className="p-4 md:flex-1 flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-2 overflow-x-auto md:overflow-x-visible md:overflow-y-auto hide-scrollbar">');

// 4. Adjust the nav buttons to not shrink on mobile
content = content.replace(/className={\`w-full flex items-center gap-3 px-4 py-3/g, 'className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3');

// 5. Add hide-scrollbar utility class in css (or inline styles)
// Actually tailwind doesn't have hide-scrollbar out of the box, we can just use standard overflow-x-auto and let it be, or add a custom class.
// Let's just use overflow-x-auto.

fs.writeFileSync('src/pages/Dashboard.tsx', content);
