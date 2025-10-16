// src/lib/vehicleSlug.ts 
// Genera el slug usado en /auto/[slug] de forma consistente en TODAS partes. 

const normalize = (s: string) => 
  s 
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '')        // quita acentos 
    .replace(/[^a-zA-Z0-9\s-]/g, '')        // quita símbolos raros 
    .replace(/\s+/g, '-')                   // espacios -> guion 
    .replace(/-+/g, '-')                    // colapsa guiones 
    .toLowerCase(); 

export function transmissionToSlug(t: string) { 
  const v = t.toLowerCase(); 
  if (v.includes('auto')) return 'automatico'; 
  if (v.includes('man')) return 'manual'; 
  return normalize(v); 
} 

export function getVehicleSlug(input: { 
  brand: string;       // e.g. "Toyota" 
  model: string;       // e.g. "Corolla" 
  year: number | string; 
  transmission?: string; // e.g. "Automática" | "Manual" 
}) { 
  const brand = normalize(String(input.brand)); 
  const model = normalize(String(input.model)); 
  const year = String(input.year).trim(); 
  const tx = input.transmission ? transmissionToSlug(input.transmission) : undefined; 

  // Estructura final tal como la usa la ficha que SÍ funciona: 
  // /auto/toyota-corolla-2020-automatico  (si hay transmisión) 
  // /auto/toyota-corolla-2020             (si no hay) 
  return tx 
    ? `${brand}-${model}-${year}-${tx}` 
    : `${brand}-${model}-${year}`; 
}