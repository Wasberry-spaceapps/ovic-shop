'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGithubFile } from '@/lib/github';
import type { Product } from '@/lib/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsReviewFilter, setNeedsReviewFilter] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const file = await getGithubFile('src/content/products.json');
        if (file) {
          setProducts(JSON.parse(file.content));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const displayedProducts = products.filter(p => {
    if (needsReviewFilter) {
      return !p.categories || p.categories.length === 0 || p.categories.includes('Uncategorized');
    }
    return true;
  });

  if (loading) return <div className="text-stone-500">Loading products from GitHub...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">Error: {error}</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
        <h1 className="text-2xl font-quicksand font-bold text-stone-900">Products ({products.length})</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={needsReviewFilter}
              onChange={(e) => setNeedsReviewFilter(e.target.checked)}
              className="rounded border-stone-300 text-coral-500 focus:ring-coral-500"
            />
            Needs Review
          </label>
          <Link 
            href="/admin/products/bulk"
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium rounded-xl transition-colors"
          >
            Bulk Import
          </Link>
          <Link 
            href="/admin/products/new"
            className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {displayedProducts.map(product => (
          <div key={product.slug} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
            <div className="flex items-center gap-4">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-12 h-16 object-cover rounded-md shadow-sm" />
              ) : (
                <div className="w-12 h-16 bg-stone-200 rounded-md shadow-sm flex items-center justify-center text-xs text-stone-400 text-center p-1">No img</div>
              )}
              <div>
                <h3 className="font-bold text-stone-900">{product.title}</h3>
                <div className="flex gap-2 mt-1">
                  {product.categories?.length ? (
                    product.categories.map(cat => (
                      <span key={cat} className={`text-xs px-2 py-0.5 rounded-full ${cat === 'Uncategorized' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Uncategorized</span>
                  )}
                </div>
              </div>
            </div>
            <Link 
              href={`/admin/products/edit/${product.slug}`}
              className="text-sm font-medium text-coral-600 hover:text-coral-700 px-3 py-1 bg-coral-50 hover:bg-coral-100 rounded-lg transition-colors"
            >
              Edit
            </Link>
          </div>
        ))}
        {displayedProducts.length === 0 && (
          <div className="p-8 text-center text-stone-500">
            No products found matching filters.
          </div>
        )}
      </div>
    </div>
  );
}
