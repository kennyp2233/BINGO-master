const fs = require('fs');
const path = require('path');

// Generar timestamp
const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '-');
const newVersion = `1.0.1-${timestamp}`;

console.log(`Updating version to: ${newVersion}`);

try {
  // Actualizar package.json
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

  // Actualizar src/config.js - reemplazar la línea de version directamente
  const configPath = path.join(__dirname, 'src', 'config.js');
  let configContent = fs.readFileSync(configPath, 'utf8');

  // Reemplazar la línea que contiene version: '...' con la nueva versión
  const versionRegex = /  version: '[^']*',/;
  const newVersionLine = `  version: '${newVersion}',`;
  configContent = configContent.replace(versionRegex, newVersionLine);

  fs.writeFileSync(configPath, configContent);
  console.log('Version updated successfully!');
} catch (error) {
  console.error('Error updating version:', error.message);
  process.exit(1);
}