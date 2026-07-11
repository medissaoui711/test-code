const fs = require('fs');
let code = fs.readFileSync('src/views/LandingPage.tsx', 'utf8');
code = code.replace(/<\/>\n/g, '');
const parts = code.split('  return (');
if (parts.length > 1) {
  const inner = parts[1];
  code = parts[0] + '  return (\n    <>\n' + inner.replace(/^      <SEO \/>/, '      <SEO />');
  
  // now replace the last "  );\n}" with "    </>\n  );\n}"
  code = code.replace(/  \);\n}$/, '    </>\n  );\n}');
}
fs.writeFileSync('src/views/LandingPage.tsx', code);
