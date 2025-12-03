export const dynamic = 'force-static';
export const revalidate = false;

import CatalogClient from './CatalogClient';
import { getVehicles } from '@/data/vehicles';

export default async function Page() {
  const vehicles = await getVehicles();

  return <CatalogClient vehicles={vehicles} />;
}