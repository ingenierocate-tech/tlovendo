const fs = require('fs');
const path = require('path');

const vehiclesPath = path.join(__dirname, '..', 'src', 'data', 'vehicles.local.json');
const autosRoot = path.join(__dirname, '..', 'public', 'autos');

function isAsciiHyphenOnly(str) {
  return !/[^\x20-\x7E]/.test(str) && !/[—‑–]/.test(str);
}

function main() {
  const raw = fs.readFileSync(vehiclesPath, 'utf8');
  const vehicles = JSON.parse(raw);
  let ok = 0, missing = 0, badSlug = 0;

  vehicles.forEach(v => {
    const slug = v.slug;
    if (!slug || !isAsciiHyphenOnly(slug)) {
      console.log(`Slug inválido o con guiones no-ASCII: "${slug}"`);
      badSlug++;
      return;
    }
    const folder = path.join(autosRoot, slug);
    const lateral = path.join(folder, '01_lateral.jpg');

    const folderExists = fs.existsSync(folder);
    const lateralExists = fs.existsSync(lateral);

    if (!folderExists || !lateralExists) {
      console.log(`Falta recurso: ${!folderExists ? 'carpeta' : ''} ${!folderExists && !lateralExists ? 'y' : ''} ${!lateralExists ? '01_lateral.jpg' : ''} -> /autos/${slug}/`);
      missing++;
    } else {
      ok++;
    }
  });

  console.log(`Verificación completa: OK=${ok}, Faltantes=${missing}, Slugs inválidos=${badSlug}`);
}

main();