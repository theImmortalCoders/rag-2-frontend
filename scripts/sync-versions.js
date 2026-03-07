const fs = require('fs');
const path = require('path');

try {
  const gamesLibPackageSourcePath = path.join(
    __dirname,
    '../node_modules/rag-2-games-lib/package.json'
  );
  const gamesLibPackageDestPath = path.join(
    __dirname,
    '../public/rag-2-games-lib-package.json'
  );

  if (!fs.existsSync(gamesLibPackageSourcePath)) {
    console.warn(
      'rag-2-games-lib package.json not found. Skipping version sync.'
    );
    process.exit(0);
  }

  const gamesLibPackageData = fs.readFileSync(gamesLibPackageSourcePath, 'utf-8');

  fs.writeFileSync(gamesLibPackageDestPath, gamesLibPackageData);

  const packageJson = JSON.parse(gamesLibPackageData);
  console.log(
    `Synced rag-2-games-lib version: ${packageJson.version}`
  );
} catch (error) {
  console.error('Error syncing versions:', error.message);
  process.exit(1);
}
