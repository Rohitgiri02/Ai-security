const { fetchRepoCode } = require('./services/github.service');

(async () => {
  try {
    const { combinedCode, fileCount } = await fetchRepoCode('digininja/DVWA');
    
    // Find all lines containing 'md5'
    const lines = combinedCode.split('\n');
    let foundCount = 0;
    let currentFile = '';
    
    console.log('=== MD5 USAGE IN digininja/DVWA ===\n');
    
    lines.forEach((line, idx) => {
      // Track current file
      if (line.includes('/* FILE:')) {
        currentFile = line;
      }
      
      if (line.toLowerCase().includes('md5')) {
        foundCount++;
        if (foundCount <= 10) {
          console.log(`\n[Match ${foundCount}]`);
          console.log(currentFile);
          console.log('-----');
          // Show context: 2 lines before and 2 lines after
          lines.slice(Math.max(0, idx - 2), Math.min(lines.length, idx + 3)).forEach((l, i) => {
            const marker = i === 2 ? '>>> ' : '    ';
            console.log(marker + l);
          });
        }
      }
    });
    
    console.log(`\n\nTotal MD5 occurrences found: ${foundCount}`);
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
