const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<\/>\n/g, '');
code = code.replace(/  return \(\n    <>\n/g, '  return (\n');
const parts = code.split('  return (');
if (parts.length > 1) {
  const inner = parts[1];
  code = parts[0] + '  return (\n    <>' + inner;
  code = code.replace(/  \);\n}$/, '    </>\n  );\n}');
}
fs.writeFileSync('src/App.tsx', code);
