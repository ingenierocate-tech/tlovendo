/* Pruna imágenes de autos vendidos: mantiene solo la principal y borra el resto */
const fs = require('fs');
const path = require('path');

const DRY_RUN = false; // Cambia a false para ejecutar borrado real

const projectRoot = path.resolve(__dirname, '..');
const vehiclesPath = path.join(projectRoot, 'src', 'data', 'vehicles.local.json');
const publicDir = path.join(projectRoot, 'public');

function isSold(vehicle) {
  const status = String(vehicle.status || vehicle.state || '').toLowerCase();
  const tags = Array.isArray(vehicle.tags) ? vehicle.tags.map(t => String(t).toLowerCase()) : [];
  return (
    vehicle.sold === true ||
    status.includes('vendido') ||
    status.includes('sold') ||
    tags.includes('vendido') ||
    tags.includes('sold')
  );
}

function normalizePublicPath(p) {
  if (!p) return null;
  const s = String(p);
  if (s.startsWith('/')) return s.slice(1);
  return s;
}

function main() {
  if (!fs.existsSync(vehiclesPath)) {
    console.error('No se encontró vehicles.local.json en', vehiclesPath);
    process.exit(1);
  }

  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));
  let soldCount = 0;
  let prunedDirs = 0;
  let removedFiles = 0;

  for (const v of vehicles) {
    if (!isSold(v)) continue;
    soldCount++;

    const mainImage = v.image || (Array.isArray(v.images) && v.images.length > 0 ? v.images[0] : null);
    if (!mainImage) {
      console.warn(`Vehículo vendido sin imagen principal: ${v.title || v.slug || 'sin título'}`);
      v.images = [];
      continue;
    }

    const mainRel = normalizePublicPath(mainImage);
    const fullMain = path.join(publicDir, mainRel);
    const dirFull = path.dirname(fullMain);

    // Asegura que el JSON tenga solo la principal
    v.images = [mainImage];

    if (!fs.existsSync(dirFull)) {
      console.warn(`No existe carpeta de imágenes: ${dirFull}`);
      continue;
    }
    if (!fs.existsSync(fullMain)) {
      console.warn(`No existe archivo principal: ${fullMain}`);
      continue;
    }

    const files = fs.readdirSync(dirFull);
    const mainBase = path.basename(fullMain);

    let removedInDir = 0;
    for (const f of files) {
      const fileFull = path.join(dirFull, f);
      try {
        const stat = fs.statSync(fileFull);
        if (stat.isDirectory()) continue; // No entrar a subcarpetas
      } catch {
        continue;
      }

      if (f !== mainBase) {
        removedInDir++;
        if (!DRY_RUN) {
          try {
            fs.rmSync(fileFull, { force: true });
          } catch (e) {
            console.warn(`No se pudo borrar: ${fileFull}`, e?.message);
          }
        }
      }
    }

    if (removedInDir > 0) {
      prunedDirs++;
      removedFiles += removedInDir;
      console.log(
        `${DRY_RUN ? '[DRY_RUN]' : '[PRUNE]'} ${dirFull} → mantenido: ${mainBase}, eliminados: ${removedInDir}`
      );
    }
  }

  // Escribir el JSON actualizado
  fs.writeFileSync(vehiclesPath, JSON.stringify(vehicles, null, 2), 'utf8');

  console.log(
    `Procesados vendidos: ${soldCount}. Carpetas podadas: ${prunedDirs}. ` +
    `${DRY_RUN ? 'Archivos que se eliminarían' : 'Archivos eliminados'}: ${removedFiles}.`
  );
}

main();