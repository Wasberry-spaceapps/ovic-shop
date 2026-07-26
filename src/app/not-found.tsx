import Link from 'next/link';
import { Pip } from '@/components/Pip';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <Pip size={120} />
      <h1 className="font-display text-4xl text-ink mt-6 mb-4">Page not found</h1>
      <p className="font-sans text-ink-light mb-8">We couldn&apos;t find what you&apos;re looking for.</p>
      <Link href="/">
        <div className="px-6 py-3 bg-coral text-cream font-display font-semibold rounded-full border-[3px] border-ink hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer" style={{ boxShadow: 'var(--shadow-cartoon)' }}>
          Go Home
        </div>
      </Link>
    </div>
  );
}
