const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPage.tsx', 'utf8');
code = code.replace(/  \);\n}$/, '    </>\n  );\n}');
code = code.replace(/  \); \n}$/, '    </>\n  );\n}');
code = code.replace(/  \);\n}\n$/, '    </>\n  );\n}\n');
fs.writeFileSync('src/views/LandingPage.tsx', code);
