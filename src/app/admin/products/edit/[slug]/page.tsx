import { EditProductPageClient } from '@/components/admin/EditProductPageClient';
import { getProducts } from '@/lib/products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export default async function EditProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <EditProductPageClient slug={slug} />;
}
