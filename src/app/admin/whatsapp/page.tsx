'use client';

import { useState, useEffect } from 'react';
import { getGithubFile, updateGithubFile } from '@/lib/github';

export default function WhatsAppSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const file = await getGithubFile('src/content/settings.json');
        if (file) {
          setSettings({ data: JSON.parse(file.content), sha: file.sha });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const newSha = await updateGithubFile(
        'src/content/settings.json',
        JSON.stringify(settings.data, null, 2),
        settings.sha,
        'admin: Updated WhatsApp settings'
      );
      setSettings((prev: any) => ({ ...prev, sha: newSha.content.sha }));
      alert('WhatsApp settings saved to GitHub!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-stone-500">Loading settings...</div>;
  if (error && !settings) return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">Error: {error}</div>;

  const rawNumber = settings.data.whatsappLink || '';
  
  // Format preview link identical to WhatsAppButton component
  const cleanNumber = rawNumber.replace(/\D/g, '');
  const previewLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hi, I am interested in: [Book Title]')}`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
      <div className="p-6 border-b border-stone-100 bg-stone-50/50">
        <h1 className="text-2xl font-quicksand font-bold text-stone-900">WhatsApp Settings</h1>
      </div>

      <div className="p-8 space-y-8">
        {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl text-sm font-medium">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Store WhatsApp Number
          </label>
          <input
            type="text"
            value={settings.data.whatsappLink}
            onChange={(e) => setSettings((prev: any) => ({
              ...prev,
              data: { ...prev.data, whatsappLink: e.target.value }
            }))}
            className="w-full max-w-md px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-coral-500"
            placeholder="+1 234 567 8900"
          />
          <p className="text-stone-500 text-sm mt-2">
            Include your country code. Formatting characters (spaces, dashes) will be automatically stripped when generating links.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
          <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">Live Link Preview</h3>
          <p className="font-mono text-sm text-stone-600 break-all mb-4">
            {previewLink}
          </p>
          <a 
            href={previewLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium rounded-full transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Test Link
          </a>
        </div>

        <div className="pt-6 border-t border-stone-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Saving to GitHub...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
