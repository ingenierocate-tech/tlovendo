import fs from 'fs-extra';
import path from 'path';
import { Vehicle } from '@/types/vehicle';

export async function completeVehicleGalleryFromDisk(v: Vehicle): Promise<Vehicle> {
  const relImage = v.image!.replace(/^\/+/, '');
  const absImagePath = path.join(process.cwd(), 'public', relImage);
  let dirPath = path.dirname(absImagePath);

  const existsDir = await fs.pathExists(dirPath);
  if (!existsDir) {
    const slugToFolder: Record<string, string> = {
      'citroen-c4-picasso-2015': 'Citroen C4 Picasso 2015',
    };
    const alias = slugToFolder[v.slug];
    if (alias) {
      const fallbackDir = path.join(process.cwd(), 'public', 'autos', alias);
      if (await fs.pathExists(fallbackDir)) {
        dirPath = fallbackDir;
      } else {
        return v;
      }
    } else {
      return v;
    }
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => /\.(jpe?g|png|webp|avif|mp4)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (files.length === 0) return v;

  const publicRoot = path.join(process.cwd(), 'public');
  const toPublicUrl = (absPath: string) =>
    '/' + path.relative(publicRoot, absPath).split(path.sep).join('/');

  const gallery = files.map((file) => {
    const abs = path.join(dirPath, file);
    const url = toPublicUrl(abs);
    return {
      url,
      alt: `${v.brand} ${v.model} ${v.year ?? ''}`.trim(),
      isPrimary: /01[_-]?lateral/i.test(file),
    };
  });

  const primaryIndex = gallery.findIndex((g) => g.isPrimary);
  if (primaryIndex > 0) {
    const [primary] = gallery.splice(primaryIndex, 1);
    gallery.unshift(primary);
  }

  return {
    ...v,
    image: gallery[0]?.url ?? v.image,
    images: gallery,
  };
}