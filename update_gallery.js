const fs = require('fs');

const files = fs.readdirSync('public/FOTO2').filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpeg'));

const images = files.map((f, i) => ({
  id: i + 1,
  url: `/FOTO2/${encodeURIComponent(f)}`,
  title: 'Graduation Session ' + (i + 1)
}));

const filePath = 'src/app/portfolio/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `const portfolioImages = ${JSON.stringify(images, null, 2)};`;

content = content.replace(/const portfolioImages = \[[\s\S]*?\];/, replacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated portfolio/page.tsx");
