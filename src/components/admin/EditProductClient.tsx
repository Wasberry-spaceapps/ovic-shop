'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getGithubFile } from '@/lib/github';
import type { Product } from '@/lib/products';

export default function EditProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const file = await getGithubFile('src/content/products.json');
        if (!file) throw new Error('Could not find products.json');
        const products: Product[] = JSON.parse(file.content);
        const found = products.find(p => p.slug === slug);
        if (!found) throw new Error('Product not found in live DB.');
        setProduct(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) return <div className="text-stone-500">Loading product from GitHub...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">Error: {error}</div>;
  if (!product) return null;

  return (
    <div>
      <h1 className="text-2xl font-quicksand font-bold text-stone-900 mb-6">Edit Product: {product.title}</h1>
      <ProductForm initialData={product} isNew={false} />
    </div>
  );
}
