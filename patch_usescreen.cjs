const fs = require('fs');

let content = fs.readFileSync('src/lib/useScreenData.ts', 'utf8');

// Replace imports
content = content.replace(/import \{ db, initAuth \} from '\.\/firebase';/g, "import { db } from './firebase';");

// Remove await initAuth();
content = content.replace(/      await initAuth\(\);/g, "");

fs.writeFileSync('src/lib/useScreenData.ts', content);
