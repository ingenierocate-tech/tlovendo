export function normalizeDriveUrl(input: string): string {
  if (!input) return '';
  
  // Si ya viene como "https://drive.google.com/uc?export=view&id=ID", devolver tal cual
  if (/\/uc\?export=view&id=/.test(input)) return input;
  
  // Extraer ID desde formatos /file/d/ID/view, ?id=ID, share links, etc.
  const byFile = input.match(/\/file\/d\/([^/]+)\//);
  const byIdParam = input.match(/[?&]id=([^&]+)/);
  const id = (byFile?.[1] || byIdParam?.[1] || '').trim();
  
  if (!id) return input; // fallback
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function gdriveViewUrlToDirect(url: string): string {
  if (!url) return '';
  // admite full URL con query
  const idMatch = url.match(/\/d\/([^/]+)\//);
  const id = idMatch?.[1] || '';
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : '';
}

export function buildImageSet(brand: string, model: string, year: number, set: {
  lateral?: string; frontal?: string; posterior?: string; tablero?: string; asientos?: string;
}) {
  // Orden y primaria: 01_lateral -> 02_frontal -> 03_posterior -> 04_tablero -> 05_asientos
  const items = [
    { key: 'lateral',   label: 'lateral'   },
    { key: 'frontal',   label: 'frontal'   },
    { key: 'posterior', label: 'posterior' },
    { key: 'tablero',   label: 'tablero'   },
    { key: 'asientos',  label: 'asientos'  },
  ] as const;

  const pretty = (label: string) =>
    `${brand} ${model} ${year} – ${label} – TLoVendo`;

  const images = items.map((it, idx) => {
    const rawUrl = (set as any)[it.key];
    if (!rawUrl) return null;
    
    const url = normalizeDriveUrl(rawUrl);
    return url
      ? { url, alt: pretty(it.label), isPrimary: idx === 0 } // 01_lateral es primary
      : null;
  }).filter(Boolean) as { url:string; alt:string; isPrimary?:boolean }[];

  // Garantiza que haya exactamente 1 primaria si existe al menos 1 imagen
  const first = images.find(Boolean);
  if (first && !images.some(i => i.isPrimary)) first.isPrimary = true;

  return images;
}