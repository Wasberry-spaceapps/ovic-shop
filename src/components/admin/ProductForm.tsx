'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/products';
import { ALL_CATEGORIES, slugify } from '@/lib/products';
import { getGithubFile, updateGithubFile } from '@/lib/github';

interface ProductFormProps {
  initialData?: Product;
  isNew?: boolean;
}

export function ProductForm({ initialData, isNew }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<Product>(
    initialData || {
      slug: '',
      title: '',
      author: '',
      description: '',
      price: 0,
      imageUrl: '',
      categories: [],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const file = await getGithubFile('src/content/products.json');
      if (!file) throw new Error('Could not find products.json');

      const products: Product[] = JSON.parse(file.content);
      
      const newSlug = slugify(formData.title);
      const finalProduct = { ...formData, slug: newSlug };

      let updatedProducts = [...products];

      if (isNew) {
        if (products.some(p => p.slug === newSlug)) {
          throw new Error('A product with this title already exists.');
        }
        updatedProducts.unshift(finalProduct);
      } else {
        const index = products.findIndex(p => p.slug === initialData?.slug);
        if (index === -1) throw new Error('Product not found to update.');
        updatedProducts[index] = finalProduct;
      }

      await updateGithubFile(
        'src/content/products.json',
        JSON.stringify(updatedProducts, null, 2),
        file.sha,
        `admin: ${isNew ? 'Added' : 'Updated'} product ${finalProduct.title}`
      );

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      const file = await getGithubFile('src/content/products.json');
      if (!file) throw new Error('Could not find products.json');

      const products: Product[] = JSON.parse(file.content);
      const updatedProducts = products.filter(p => p.slug !== initialData?.slug);

      await updateGithubFile(
        'src/content/products.json',
        JSON.stringify(updatedProducts, null, 2),
        file.sha,
        `admin: Deleted product ${initialData?.title}`
      );

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    const current = formData.categories || [];
    if (current.includes(cat)) {
      setFormData({ ...formData, categories: current.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...current, cat] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[24px] shadow-[4px_4px_0px_0px_var(--ink)] border-[3px] border-ink p-8 space-y-6">
      {error && <div className="text-coral bg-cream-dark p-4 rounded-xl font-sans font-medium">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-sans font-semibold text-ink mb-1">Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-cream border-[3px] border-ink rounded-xl focus:outline-none focus:border-coral font-sans"
          />
        </div>
        <div>
          <label className="block font-sans font-semibold text-ink mb-1">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-3 bg-cream border-[3px] border-ink rounded-xl focus:outline-none focus:border-coral font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-sans font-semibold text-ink mb-1">Price (numeric)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 bg-cream border-[3px] border-ink rounded-xl focus:outline-none focus:border-coral font-sans"
          />
        </div>
        <div>
          <label className="block font-sans font-semibold text-ink mb-1">Cover Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-3 bg-cream border-[3px] border-ink rounded-xl focus:outline-none focus:border-coral font-sans"
          />
        </div>
      </div>

      <div>
        <label className="block font-sans font-semibold text-ink mb-1">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-cream border-[3px] border-ink rounded-xl focus:outline-none focus:border-coral font-sans"
        />
      </div>

      <div>
        <label className="block font-sans font-semibold text-ink mb-3">Categories</label>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map(cat => {
            const isSelected = formData.categories?.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-sans font-semibold transition-colors border-[3px] border-ink ${
                  isSelected 
                    ? 'bg-sky text-ink shadow-[2px_2px_0px_0px_var(--ink)] -translate-y-0.5' 
                    : 'bg-cream text-ink hover:bg-cream-dark'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t-2 border-ink/10 flex justify-between items-center">
        {!isNew ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-coral hover:underline px-4 py-2 rounded-xl transition-colors font-sans font-semibold disabled:opacity-50"
          >
            Delete Product
          </button>
        ) : <div />}
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="text-ink hover:underline px-4 py-2 rounded-xl transition-colors font-sans font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-coral text-cream border-[3px] border-ink shadow-[4px_4px_0px_0px_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--ink)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_var(--ink)] px-6 py-2 rounded-xl transition-all font-display font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving to GitHub...' : (isNew ? 'Create Product' : 'Save Changes')}
          </button>
        </div>
      </div>
    </form>
  );
}
