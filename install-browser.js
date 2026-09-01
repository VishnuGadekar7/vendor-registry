const { execSync } = require('child_process');

console.log('=========================================');
console.log('🚀 FORCING PUPPETEER TO DOWNLOAD CHROME...');
console.log('=========================================');

// Forcefully override any broken environment variables from the Render dashboard
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'false';

try {
  // Execute the browser install command, piping output to the console so we can see it in Render logs
  execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' });
  console.log('✅ Chrome downloaded successfully!');
} catch (error) {
  console.error('❌ Failed to download Chrome:', error.message);
  process.exit(1);
}
