const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID!;
const FOTOS_GID = process.env.NEXT_PUBLIC_SHEET_FOTOS_GID!; // pestaña "Fotos"
const VEHICULOS_GID = process.env.NEXT_PUBLIC_SHEET_VEHICULOS_GID!; // pestaña principal

export type FotoRow = {
  Marca: string; Modelo: string; Año: string; Versión: string;
  Frontal: string; Lateral: string; Posterior: string; Tablero: string; Asientos: string;
};

export type VehiculoRow = {
  Marca: string;
  Modelo: string;
  Año: string;
  Versión: string;
  Dueños: string;
  Kilometraje: string;
  Color: string;
  Transmisión: string;
  Precio: string;
  Combustible: string;
  Ubicación: string;
  Estado: string;
  Motor: string;
  Potencia: string;
  Consumo: string;
  Emisiones: string;
  ABS: string;
  ESP: string;
  Airbags: string;
  'Control de tracción': string;
  'Aire acondicionado': string;
  'Dirección asistida': string;
  'Alzavidrios eléctricos': string;
  'Espejos eléctricos': string;
  'Sistema de audio': string;
  Bluetooth: string;
  USB: string;
  'Control crucero': string;
  Vínculo: string;
};

export async function fetchFotosCsv(): Promise<FotoRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${FOTOS_GID}`;
  const res = await fetch(url);
  const csv = await res.text();

  const [headerLine, ...lines] = csv.split('\n').filter(Boolean);
  const headers = headerLine.split(',').map(h => h.trim());

  return lines.map(line => {
    // Manejo simple de CSV; la sheet no tiene comas en URL.
    const cols = line.split(',').map(c => c.trim());
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = cols[i] || ''));
    return obj as FotoRow;
  });
}

export async function fetchVehiculosCsv(): Promise<VehiculoRow[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${VEHICULOS_GID}`;
  const res = await fetch(url);
  const csv = await res.text();

  const [headerLine, ...lines] = csv.split('\n').filter(Boolean);
  const headers = headerLine.split(',').map(h => h.trim());

  return lines.map(line => {
    // Manejo simple de CSV; la sheet no tiene comas en URL.
    const cols = line.split(',').map(c => c.trim());
    const obj: any = {};
    headers.forEach((h, i) => (obj[h] = cols[i] || ''));
    return obj as VehiculoRow;
  });
}