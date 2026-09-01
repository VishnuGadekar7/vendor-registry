const { execSync } = require('child_process');

console.log('=========================================');
console.log('🚀 FORCING PUPPETEER TO DOWNLOAD CHROME...');
console.log('=========================================');

// Forcefully override any broken environment variables from the Render dashboard
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'false';

const fs = require('fs');
const path = require('path');
const cacheDir = path.join(__dirname, '.cache');

try {
  if (fs.existsSync(cacheDir)) {
    console.log('🗑️ Clearing corrupted browser cache...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
} catch (e) {
  console.log('Warning: could not clear cache:', e.message);
}

try {
  // Directly run the Puppeteer install script (npx can be buggy during postinstall before binaries are linked)
  execSync('node node_modules/puppeteer/install.mjs', { stdio: 'inherit' });
  console.log('✅ Chrome downloaded successfully!');
} catch (error) {
  console.error('❌ Failed to download Chrome:', error.message);
  process.exit(1);
}
