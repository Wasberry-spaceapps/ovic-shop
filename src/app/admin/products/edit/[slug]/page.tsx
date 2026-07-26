import EditProductClient from '@/components/admin/EditProductClient';

import { getProducts } from '@/lib/products';

export async function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export default function EditProductPage() {
  return <EditProductClient />;
}
