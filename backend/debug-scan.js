const { scanCodeForPatterns } = require('./services/scan.service');

const testCode = `/* FILE: app.js */
const x = eval(userInput);

/* FILE: login.php */
$pass = md5($pass);
SELECT * FROM users WHERE id = $id;
`;

console.log('Test code (lines):', testCode.split('\n').length);
const patterns = scanCodeForPatterns(testCode);
console.log('\nPatterns detected:', patterns.length);
patterns.forEach(p => {
  console.log(`  [${p.id}] ${p.pattern} in ${p.file}:${p.line} => ${p.code}`);
});

// Also test shouldScanFile logic
console.log('\nFile filtering test:');
const files = ['app.js', 'login.php', 'README.md', 'test/app.test.js', 'docs/api.md'];
const { scanCodeForPatterns: _, validateIssuesWithAI } = require('./services/scan.service');

// Test with the patterns module to see shouldScanFile behavior
console.log('(Checking if files would be scanned...)');
