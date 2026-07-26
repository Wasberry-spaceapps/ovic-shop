'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/products';
import { ProductImage } from './ProductImage';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`}>
      <motion.div
        className="bg-cream-dark border-[3px] border-ink rounded-[24px] overflow-hidden cursor-pointer group flex flex-col h-full"
        style={{ boxShadow: 'var(--shadow-cartoon)' }}
        whileHover={{ y: -4, boxShadow: 'var(--shadow-cartoon-hover)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="aspect-[2/3] overflow-hidden bg-cream">
          <ProductImage
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 text-center flex-1 flex flex-col justify-center">
          <h2 className="font-display text-base sm:text-lg font-semibold text-ink leading-tight group-hover:text-coral transition-colors">
            {product.title}
          </h2>
        </div>
      </motion.div>
    </Link>
  );
}
