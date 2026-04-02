import { Vehicle } from '@/types/vehicle';

export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { slug: 'suv', name: 'SUV', icon: '/suv.png' },
  { slug: 'sedan', name: 'Sedán', icon: '/sedan.png' },
  { slug: 'hatchback', name: 'Hatchback', icon: '/hatchback.png' },
  { slug: 'camioneta', name: 'Camionetas', icon: '/camioneta.png' },
  { slug: 'citycar', name: 'Citycar', icon: '/citycar.png' },
  { slug: 'utilitario', name: 'Utilitarios', icon: '/utilitario.png' },
];

const MODEL_KEYWORDS: Record<string, string> = {
  // SUV
  'tucson': 'suv',
  'forester': 'suv',
  'pathfinder': 'suv',
  'x1': 'suv',
  'tahoe': 'suv',
  'sonet': 'suv',
  'glc': 'suv',
  'coolray': 'suv',
  'corolla cross': 'suv',
  'x-trail': 'suv',
  'xtrail': 'suv',
  '5008': 'suv',
  '3008': 'suv',
  'compass': 'suv',
  'captiva': 'suv',
  'territory': 'suv',
  
  // Sedan
  '320i': 'sedan',
  '320d': 'sedan',
  'sentra': 'sedan',
  'panamera': 'sedan',
  'fusion': 'sedan',
  'soluto': 'sedan',
  'avensis': 'sedan',
  '301': 'sedan',
  'c-elysee': 'sedan',
  'c elysee': 'sedan',
  'a200': 'sedan',
  'mazda 3': 'sedan',
  'mazda-3': 'sedan',
  'mazda 6': 'sedan',
  'bora': 'sedan',
  'virtus': 'sedan',
  
  // Hatchback
  'rio': 'hatchback',
  'c3': 'hatchback',
  'c4': 'hatchback',
  '208': 'hatchback',
  '308': 'hatchback',
  'swift': 'hatchback',
  'baleno': 'hatchback',
  'polo': 'hatchback',
  'ibiza': 'hatchback',
  'yaris': 'hatchback',
  'corsa': 'hatchback',
  '118i': 'hatchback',
  'uno': 'hatchback',
  'uno way': 'hatchback',
  'raize': 'hatchback',
  
  // Camioneta
  'silverado': 'camioneta',
  'wingle': 'camioneta',
  'f150': 'camioneta',
  'f-150': 'camioneta',
  'hilux': 'camioneta',
  'l200': 'camioneta',
  'navara': 'camioneta',
  'ranger': 'camioneta',
  'colorado': 'camioneta',
  'amarok': 'camioneta',
  'poer': 'camioneta',
  'd-max': 'camioneta',
  'd max': 'camioneta',
  'dmax': 'camioneta',
  
  // Citycar
  'morning': 'citycar',
  'alto': 'citycar',
  'celerio': 'citycar',
  'spark': 'citycar',
  'i10': 'citycar',
  's-presso': 'citycar',
  'kwid': 'citycar',
  'mobi': 'citycar',

  // Utilitarios
  'partner': 'utilitario',
  'berlingo': 'utilitario',
  'kangoo': 'utilitario',
  'fiorino': 'utilitario',
  'sprinter': 'utilitario',
  'boxer': 'utilitario',
  'ducato': 'utilitario',
  'transit': 'utilitario',
  'vito': 'utilitario',
  'expert': 'utilitario',
  'jumpy': 'utilitario',
  'n300': 'utilitario',
  'n400': 'utilitario',
  'porter': 'camioneta',
  'h1': 'utilitario',
  'h-1': 'utilitario',
  'rifter': 'utilitario',
  'combo': 'utilitario',
  'dokker': 'utilitario',
};

export function getVehicleCategory(vehicle: Vehicle): string | undefined {
  // Normalize strings for comparison
  const model = (vehicle.model || '').toLowerCase();
  const slug = (vehicle.slug || '').toLowerCase();
  const brand = (vehicle.brand || '').toLowerCase();
  const version = (vehicle.version || '').toLowerCase();
  const description = (vehicle.description || '').toLowerCase();

  const text = `${brand} ${model} ${version} ${slug} ${description}`.trim();

  // Check model keywords
  for (const [keyword, category] of Object.entries(MODEL_KEYWORDS)) {
    // Check if model contains keyword (e.g. "Rio 5" contains "rio")
    if (text.includes(keyword)) {
      return category;
    }
  }

  // Fallbacks genéricos si no detecta por modelo
  if (text.includes('suv')) return 'suv';
  if (text.includes('sedan') || text.includes('sedán')) return 'sedan';
  if (text.includes('hatchback')) return 'hatchback';
  if (text.includes('camioneta') || text.includes('pickup') || text.includes('pick-up')) return 'camioneta';
  if (text.includes('citycar') || text.includes('city car')) return 'citycar';
  if (text.includes('utilitario') || text.includes('furgon') || text.includes('furgón') || text.includes('van')) return 'utilitario';

  return undefined;
}