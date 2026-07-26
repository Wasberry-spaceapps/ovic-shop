'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseBulkInput, ParsedProduct } from '@/lib/bulk-import';
import { getGithubFile, updateGithubFile } from '@/lib/github';
import type { Product } from '@/lib/products';

export default function BulkImportPage() {
  const router = useRouter();
  const [rawInput, setRawInput] = useState('');
  const [preview, setPreview] = useState<ParsedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = () => {
    try {
      const parsed = parseBulkInput(rawInput);
      setPreview(parsed);
      setError('');
    } catch (err: any) {
      setError('Failed to parse input: ' + err.message);
    }
  };

  const handleCommit = async () => {
    if (preview.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const file = await getGithubFile('src/content/products.json');
      if (!file) throw new Error('Could not find products.json');

      const existingProducts: Product[] = JSON.parse(file.content);
      
      const newProducts: Product[] = preview.map(p => ({
        slug: p.slug,
        title: p.title,
        author: 'Unknown Author', // Default placeholder
        description: '',
        price: 9.99, // Default placeholder
        imageUrl: p.imageUrl,
        categories: [],
      }));

      // Merge avoiding duplicate slugs
      const existingSlugs = new Set(existingProducts.map(p => p.slug));
      const actuallyNew = newProducts.filter(p => !existingSlugs.has(p.slug));

      if (actuallyNew.length === 0) {
        throw new Error('All items in this bulk import already exist in the catalog.');
      }

      const finalProducts = [...actuallyNew, ...existingProducts];

      await updateGithubFile(
        'src/content/products.json',
        JSON.stringify(finalProducts, null, 2),
        file.sha,
        `admin: Bulk imported ${actuallyNew.length} products`
      );

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
      <h1 className="text-2xl font-quicksand font-bold text-stone-900 mb-2">Bulk Importer</h1>
      <p className="text-stone-500 mb-6">
        Paste a list of book titles and cover image URLs (one per line, separated by a comma or pipe).
      </p>

      {error && <div className="mb-6 text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium">{error}</div>}

      <div className="space-y-6">
        <textarea
          rows={10}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="To Kill a Mockingbird, https://example.com/cover1.jpg&#10;1984 | https://example.com/cover2.jpg"
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500 font-mono text-sm"
        />

        <button
          onClick={handleParse}
          disabled={!rawInput.trim() || loading}
          className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          Preview Parsed Results
        </button>

        {preview.length > 0 && (
          <div className="mt-8 border-t border-stone-100 pt-8">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Preview ({preview.length} items)</h2>
            <div className="bg-stone-50 rounded-xl p-4 max-h-64 overflow-y-auto mb-6">
              <ul className="divide-y divide-stone-200">
                {preview.map((p, i) => (
                  <li key={i} className="py-2 flex justify-between text-sm">
                    <span className="font-medium text-stone-800">{p.title}</span>
                    <span className="text-stone-500 truncate max-w-xs">{p.imageUrl || 'No image'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleCommit}
              disabled={loading}
              className="w-full bg-coral-500 hover:bg-coral-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Committing to GitHub...' : `Commit ${preview.length} Books to Database`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
