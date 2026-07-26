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
    <div className="min-h-screen bg-stone-50 text-stone-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-200">
          <Link href="/" className="text-xl font-bold font-quicksand text-coral-600">
            Shop Admin
          </Link>
          <div className="text-xs text-stone-500 mt-1">Live DB: GitHub</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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
          <div className="p-4 border-t border-stone-200">
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
      <main className="flex-1 overflow-auto bg-stone-50 p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
