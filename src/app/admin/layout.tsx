'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getGithubSettings, clearGithubSettings } from '@/lib/github';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const settings = getGithubSettings();
    setIsConfigured(!!settings);
    if (!settings && pathname !== '/admin/settings') {
      router.push('/admin/settings');
    }
  }, [pathname, router]);

  const navItems = [
    { label: 'Products', href: '/admin/products' },
    { label: 'Content Console', href: '/admin/content' },
    { label: 'WhatsApp', href: '/admin/whatsapp' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  if (isConfigured === null) return null; // Hydration check

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-stone-200 flex flex-col shrink-0">
        <div className="p-4 md:p-6 border-b border-stone-200 flex justify-between items-center md:block">
          <div>
            <Link href="/" className="text-xl font-bold font-quicksand text-coral-600">
              Shop Admin
            </Link>
            <div className="text-xs text-stone-500 mt-1">Live DB: GitHub</div>
          </div>
        </div>
        
        <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-coral-100 text-coral-900' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {isConfigured && (
          <div className="p-2 md:p-4 border-t border-stone-200">
            <button
              onClick={() => {
                clearGithubSettings();
                window.location.href = '/admin/settings';
              }}
              className="w-full px-4 py-2 text-sm text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left font-medium"
            >
              Disconnect GitHub
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-stone-50 flex flex-col">
        <div className="bg-amber-100 px-4 py-3 border-b border-amber-200 text-amber-900 text-sm md:text-base text-center shadow-sm">
          ⚠️ <strong>Notice:</strong> Please limit your edits to avoid exhausting your free GitHub Actions quota (2000 mins/month). Make all changes at once before saving!
        </div>
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
