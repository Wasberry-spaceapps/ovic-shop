import Link from 'next/link';

export function Breadcrumb({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <span className="font-display font-semibold text-ink-light hover:text-coral transition-colors cursor-pointer mb-6 inline-block">
        ← {label}
      </span>
    </Link>
  );
}
