const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "../src/data/vehicles.local.json");
const AUTOS_DIR = path.join(__dirname, "../public/autos");

const REQUIRED_FIELDS = [
  "id", "slug", "brand", "model", "version", "year", "owners", "color",
  "transmission", "fuel", "region", "state", "engine", "power",
  "consumption", "emissions", "abs", "esp", "tractionControl",
  "airConditioning", "powerSteering", "electricWindows", "electricMirrors",
  "audioSystem", "bluetooth", "usb", "cruiseControl", "image", "images",
  "image"
];

function validateVehicle(v) {
  let ok = true;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in v)) {
      console.warn(`⚠️  Falta campo "${field}" en id=${v.id} slug="${v.slug}"`);
      ok = false;
    }
  }

  if (!String(v.image).includes("01_lateral.jpg")) {
    console.warn(`❌ Imagen principal incorrecta en id=${v.id}: ${v.image}`);
    ok = false;
  }

  // Verifica carpeta y archivo físicamente
  const folder = path.join(AUTOS_DIR, String(v.slug || ""));
  const lateral = path.join(folder, "01_lateral.jpg");
  if (!fs.existsSync(folder)) {
    console.warn(`❌ No existe carpeta: /public/autos/${v.slug}`);
    ok = false;
  } else if (!fs.existsSync(lateral)) {
    console.warn(`❌ Falta archivo: /public/autos/${v.slug}/01_lateral.jpg`);
    ok = false;
  }

  return ok;
}

function main() {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const vehicles = JSON.parse(raw);

    if (!Array.isArray(vehicles)) {
      throw new Error("El JSON debe ser un arreglo de vehículos");
    }

    let validCount = 0;
    vehicles.forEach((v) => {
      if (validateVehicle(v)) validCount++;
    });

    console.log(`✅ Vehículos válidos: ${validCount}/${vehicles.length}`);
    if (validCount < vehicles.length) {
      console.warn("🔧 Algunos vehículos presentan errores. Revisa los avisos arriba.");
    } else {
      console.log("👌 Todos los vehículos cumplen estructura y paths principales.");
    }
  } catch (err) {
    console.error("❌ Error al validar vehicles.local.json:", err.message);
    process.exit(1);
  }
}

main();