const fs = require('fs');
const path = require('path');

try {
  const frontendPackagePath = path.join(__dirname, '../package.json');
  const gamesLibPackagePath = path.join(
    __dirname,
    '../node_modules/rag-2-games-lib/package.json'
  );
  const versionsOutputPath = path.join(
    __dirname,
    '../src/app/shared/constants/versions.ts'
  );

  const frontendPackageData = JSON.parse(
    fs.readFileSync(frontendPackagePath, 'utf-8')
  );

  let gamesLibVersion = 'unknown';

  try {
    if (fs.existsSync(gamesLibPackagePath)) {
      const gamesLibPackageData = JSON.parse(
        fs.readFileSync(gamesLibPackagePath, 'utf-8')
      );
      gamesLibVersion = gamesLibPackageData.version;
    }
  } catch (error) {
    console.warn(
      'Could not read rag-2-games-lib version. Using "unknown".'
    );
  }

  const versionContent = `export const APP_VERSIONS = {
  frontend: '${frontendPackageData.version}',
  gamesLib: '${gamesLibVersion}',
} as const;
`;

  const outputDir = path.dirname(versionsOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(versionsOutputPath, versionContent);

  console.log(`Generated versions file:`);
  console.log(`  Frontend: ${frontendPackageData.version}`);
  console.log(`  Games Library: ${gamesLibVersion}`);
} catch (error) {
  console.error('Error syncing versions:', error.message);
  process.exit(1);
}
