import { getProducts } from '@/lib/products';
import { ShopGrid } from '@/components/ShopGrid';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'Shop — Ovic Bookstore',
  description: 'Browse our collection of books.',
};

export default function ShopPage() {
  const products = getProducts();

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb href="/" label="Home" />
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-10">
        Shop
      </h1>

      <ShopGrid initialProducts={products} />
    </div>
  );
}
