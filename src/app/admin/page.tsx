'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGithubSettings } from '@/lib/github';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const settings = getGithubSettings();
    if (settings) {
      router.push('/admin/products');
    } else {
      router.push('/admin/settings');
    }
  }, [router]);

  return <div className="p-8 text-stone-500">Loading admin panel...</div>;
}
