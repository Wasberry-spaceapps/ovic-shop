'use client';

import { useState, useMemo } from 'react';
import Fuse from '@/lib/fuse';
import type { Product } from '@/lib/products';
import { ALL_CATEGORIES } from '@/lib/products';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopGridProps {
  initialProducts: Product[];
  initialCategory?: string;
}

const PAGE_SIZE = 24;

export function ShopGrid({ initialProducts, initialCategory }: ShopGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Initialize Fuse index once
  const fuse = useMemo(() => new Fuse(initialProducts, {
    keys: ['title'],
    threshold: 0.3,
  }), [initialProducts]);

  const filteredProducts = useMemo(() => {
    let results = initialProducts;

    // Apply search
    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map((res: any) => res.item);
    }

    // Apply category filter
    if (selectedCategory) {
      results = results.filter(p => p.categories?.includes(selectedCategory));
    }

    return results;
  }, [initialProducts, searchQuery, selectedCategory, fuse]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategory(prev => prev === cat ? null : cat);
    setVisibleCount(PAGE_SIZE); // reset pagination on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE); // reset pagination on search change
  };

  // We only show categories that actually have products in the catalog
  const activeCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach(p => {
      p.categories?.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return ALL_CATEGORIES.filter(cat => counts[cat] > 0);
  }, [initialProducts]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-md mx-auto sm:mx-0">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-6 py-4 bg-cream-dark border-[3px] border-ink rounded-full font-sans text-ink placeholder-ink-light focus:outline-none focus:border-coral transition-colors"
            style={{ boxShadow: 'var(--shadow-cartoon)' }}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Categories (horizontal scroll) */}
        {activeCategories.length > 0 && (
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {activeCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full border-[3px] border-ink font-display font-medium transition-all ${
                    isSelected 
                      ? 'bg-coral text-cream border-ink' 
                      : 'bg-cream text-ink hover:bg-cream-dark'
                  }`}
                  style={{ boxShadow: isSelected ? 'none' : '2px 2px 0px 0px var(--ink)' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="text-6xl mb-4">🦉</div>
          <h3 className="font-display text-2xl font-semibold text-ink">No books found</h3>
          <p className="font-sans text-ink-light mt-2">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-8 py-4 bg-sky text-ink font-display font-bold text-xl border-[3px] border-ink rounded-full hover:bg-cream-dark transition-colors"
                style={{ boxShadow: 'var(--shadow-cartoon)' }}
              >
                Load More Books
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
