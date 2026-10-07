import EditProductClient from '@/components/admin/EditProductClient';

import { getProducts } from '@/lib/products';

export async function generateStaticParams() {
  const products = getProducts();
  if (products.length === 0) {
    return [{ slug: '_placeholder' }];
  }
  return products.map((product) => ({ slug: product.slug }));
}

export default function EditProductPage() {
  return <EditProductClient />;
}
