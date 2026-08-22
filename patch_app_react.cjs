const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = "import React from 'react';\n" + content;
fs.writeFileSync('src/App.tsx', content);
