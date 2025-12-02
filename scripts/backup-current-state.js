/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fsp.copyFile(src, dest);
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath);
    }
  }
}

async function exists(p) {
  try {
    await fsp.access(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const ROOT = path.resolve(__dirname, '..');
  const ts = nowStamp();
  const DEST = path.join(ROOT, 'Tlovendo_backup', 'backups', ts);

  const items = [
    // Datos
    { kind: 'file', src: path.join(ROOT, 'src', 'data', 'vehicles.local.json') },
    { kind: 'file', src: path.join(ROOT, 'src', 'data', 'vehicles.slugs.local.json') },
    // Config útil
    { kind: 'file', src: path.join(ROOT, 'package.json') },
    // Componentes relevantes
    { kind: 'file', src: path.join(ROOT, 'src', 'components', 'VehicleContactButtons.tsx') },
    { kind: 'file', src: path.join(ROOT, 'src', 'components', 'VehicleCard.tsx') },
    { kind: 'file', src: path.join(ROOT, 'src', 'components', 'VehicleCardImage.tsx') },
    { kind: 'file', src: path.join(ROOT, 'src', 'components', 'VehicleGrid.tsx') },
    { kind: 'file', src: path.join(ROOT, 'src', 'components', 'SoldVehicleCard.tsx') },
    // Imágenes
    { kind: 'dir', src: path.join(ROOT, 'public', 'autos') },
  ];

  await ensureDir(DEST);

  const copied = [];
  const skipped = [];

  for (const item of items) {
    const rel = path.relative(ROOT, item.src);
    const destPath = path.join(DEST, rel);
    const present = await exists(item.src);
    if (!present) {
      console.warn(`SKIP: no encontrado -> ${rel}`);
      skipped.push({ src: rel, reason: 'missing' });
      continue;
    }
    try {
      if (item.kind === 'file') {
        await copyFile(item.src, destPath);
      } else if (item.kind === 'dir') {
        await copyDir(item.src, destPath);
      }
      copied.push({ src: rel, dest: path.relative(ROOT, destPath), kind: item.kind });
      console.log(`OK: ${rel}`);
    } catch (err) {
      console.error(`ERROR copiando ${rel}:`, err.message);
      skipped.push({ src: rel, reason: err.message });
    }
  }

  const manifest = {
    createdAt: new Date().toISOString(),
    timestamp: ts,
    destination: path.relative(ROOT, DEST),
    copied,
    skipped,
  };

  await ensureDir(DEST);
  await fsp.writeFile(path.join(DEST, 'backup.manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('\nBackup completado:');
  console.log(`- Carpeta destino: ${manifest.destination}`);
  console.log(`- Archivos copiados: ${copied.length}`);
  console.log(`- Skips: ${skipped.length}`);
}

main().catch((e) => {
  console.error('Fallo inesperado en backup:', e);
  process.exit(1);
});