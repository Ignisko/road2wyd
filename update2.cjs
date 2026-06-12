const fs = require('fs');

const indexFile = 'c:/Users/ignac/Documents/github projects/Catholic_projects/wyd_map/index.html';
const transFile = 'c:/Users/ignac/Documents/github projects/Catholic_projects/wyd_map/translations.js';

let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(/<\/a> — /g, '</a>, ');
fs.writeFileSync(indexFile, indexContent, 'utf8');

let transContent = fs.readFileSync(transFile, 'utf8');
transContent = transContent.replace(/<\/strong> — /g, '</strong>, ');
fs.writeFileSync(transFile, transContent, 'utf8');

console.log('Update2 complete.');
