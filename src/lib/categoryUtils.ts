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
  
  // Sedan
  '320i': 'sedan',
  'sentra': 'sedan',
  'panamera': 'sedan',
  'fusion': 'sedan',
  'soluto': 'sedan',
  'avensis': 'sedan',
  '301': 'sedan',
  'c-elysee': 'sedan',
  'c elysee': 'sedan',
  'mazda 3': 'sedan',
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
  'porter': 'utilitario',
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
  
  // Check model keywords
  for (const [keyword, category] of Object.entries(MODEL_KEYWORDS)) {
    // Check if model contains keyword (e.g. "Rio 5" contains "rio")
    if (model.includes(keyword) || slug.includes(keyword)) {
      return category;
    }
  }
  
  // Fallbacks genéricos si no detecta por modelo
  if (model.includes('suv') || slug.includes('suv')) return 'suv';
  if (model.includes('sedan') || slug.includes('sedan')) return 'sedan';
  if (model.includes('furgon') || slug.includes('furgon') || model.includes('van') || slug.includes('van')) return 'utilitario';
  
  return undefined;
}