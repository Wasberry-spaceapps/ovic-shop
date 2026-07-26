import { getProducts, ALL_CATEGORIES, slugify } from '@/lib/products';
import { ShopGrid } from '@/components/ShopGrid';
import { Breadcrumb } from '@/components/Breadcrumb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((cat) => ({
    category: slugify(cat),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCat = ALL_CATEGORIES.find(c => slugify(c) === category);
  
  if (!decodedCat) return { title: 'Not Found' };
  
  return {
    title: `${decodedCat} Books — Ovic Bookstore`,
    description: `Browse our collection of ${decodedCat} books at Ovic Bookstore.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const decodedCat = ALL_CATEGORIES.find(c => slugify(c) === category);

  if (!decodedCat) {
    notFound();
  }

  const products = getProducts();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb href="/shop" label="All Books" />
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-10">
        {decodedCat}
      </h1>

      <ShopGrid initialProducts={products} initialCategory={decodedCat} />
    </div>
  );
}
