import { getProduct, getProducts } from '@/lib/products';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductImage } from '@/components/ProductImage';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Not Found' };
  return {
    title: `${product.title} — Ovic Bookstore`,
    description: `Buy ${product.title} at Ovic Bookstore.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb href="/shop" label="Back to Shop" />

      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        {/* Cover Image */}
        <div className="w-full md:w-1/2 flex-shrink-0">
          <div
            className="bg-cream-dark border-[3px] border-ink rounded-[24px] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-cartoon)' }}
          >
            <ProductImage
              src={product.imageUrl}
              alt={product.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-6 py-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">
            {product.title}
          </h1>

          {/* Decorative divider */}
          <div className="flex">
            <svg aria-hidden="true" width="120" height="20" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="font-sans text-ink-light leading-relaxed">
            Interested in this book? Reach out to us directly via WhatsApp and we&apos;ll get it to you!
          </p>

          <WhatsAppButton bookTitle={product.title} />
        </div>
      </div>
    </div>
  );
}
