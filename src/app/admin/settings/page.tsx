'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGithubSettings, saveGithubSettings, GithubSettings } from '@/lib/github';

export default function SettingsPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<GithubSettings>({
    token: '',
    owner: '',
    repo: '',
    branch: 'main'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getGithubSettings();
    if (existing) {
      setFormData(existing);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveGithubSettings(formData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/admin/products');
    }, 1500);
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <h1 className="text-3xl font-quicksand font-bold text-stone-900 mb-2">GitHub Persistence Settings</h1>
      <p className="text-stone-500 mb-8">
        This admin panel writes directly to your GitHub repository. Your token is stored locally in your browser and never sent to any third-party server.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Personal Access Token</label>
          <input
            type="password"
            required
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-colors"
            placeholder="github_pat_..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Repository Owner</label>
            <input
              type="text"
              required
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-colors"
              placeholder="e.g. yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Repository Name</label>
            <input
              type="text"
              required
              value={formData.repo}
              onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-colors"
              placeholder="e.g. ovic-shop"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Branch</label>
          <input
            type="text"
            required
            value={formData.branch}
            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-coral-500 transition-colors"
            placeholder="main"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-coral-500 hover:bg-coral-600 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center"
          >
            {saved ? 'Saved & Connecting...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
