const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../../src/context/AppContext.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Let's verify markers
const marker1 = 'export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {';
const marker2 = '  // Curricular Actions\n  const addCompetency';

if (!content.includes(marker1) || !content.includes(marker2)) {
  console.error('Markers not found!');
  process.exit(1);
}

console.log('Markers found successfully.');
