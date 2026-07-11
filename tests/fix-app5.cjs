const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const index = code.lastIndexOf('    </div>');
code = code.substring(0, index + 10) + '\n    </>\n  );\n}\n';
fs.writeFileSync('src/App.tsx', code);
