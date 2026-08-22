const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace(/onChange={\(e\) => toggleActive\(text\.id!, e\.target\.checked\)}/g, 
`onChange={(e) => toggleActiveText(text.id!, e.target.checked)}`);

content = content.replace(/let s = await db\.settings\.get\(1\);\s*if \(!s\) \{\s*await db\.settings\.put\(defaultSettings\);\s*\}/g,
`// Firebase handles default settings`);

content = content.replace(/db\.settings\.put\(newSettings\)\.then\(\(\) => \{/g,
`updateScreenData({ settings: newSettings }).then(() => {`);

fs.writeFileSync('src/pages/Dashboard.tsx', content);
