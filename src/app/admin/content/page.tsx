'use client';

import { useState, useEffect } from 'react';
import { getGithubFile, updateGithubFile } from '@/lib/github';

export default function ContentConsolePage() {
  const [registry, setRegistry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [selectedPage, setSelectedPage] = useState<string>('home');

  useEffect(() => {
    async function loadContent() {
      try {
        const file = await getGithubFile('src/content/registry.json');
        if (file) {
          setRegistry({ data: JSON.parse(file.content), sha: file.sha });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleFieldChange = (pageKey: string, fieldKey: string, value: string) => {
    setRegistry((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        [pageKey]: {
          ...prev.data[pageKey],
          fields: {
            ...prev.data[pageKey].fields,
            [fieldKey]: value
          }
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const newSha = await updateGithubFile(
        'src/content/registry.json',
        JSON.stringify(registry.data, null, 2),
        registry.sha,
        `admin: Updated content for ${registry.data[selectedPage].title}`
      );
      setRegistry((prev: any) => ({ ...prev, sha: newSha.content.sha }));
      alert('Content saved to GitHub!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-stone-500">Loading content registry...</div>;
  if (error && !registry) return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">Error: {error}</div>;

  const pages = Object.keys(registry.data);
  const currentPageData = registry.data[selectedPage];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-quicksand font-bold text-stone-900">Global Content Console</h1>
        
        <div className="flex gap-4 items-center">
          <select 
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 bg-white border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-coral-500"
          >
            {pages.map(p => (
              <option key={p} value={p}>{registry.data[p].title} Page</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium">{error}</div>}

        <h2 className="text-xl font-bold text-stone-900 mb-6">Editing: {currentPageData.title}</h2>

        {Object.entries(currentPageData.fields).map(([fieldKey, value]) => (
          <div key={fieldKey}>
            <label className="block text-sm font-medium text-stone-700 mb-2 capitalize">
              {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {typeof value === 'string' && value.length > 50 ? (
              <textarea
                rows={4}
                value={value as string}
                onChange={(e) => handleFieldChange(selectedPage, fieldKey, e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500"
              />
            ) : (
              <input
                type="text"
                value={value as string}
                onChange={(e) => handleFieldChange(selectedPage, fieldKey, e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
