import Link from 'next/link';
import { Logo } from './Logo';
import { Pip } from './Pip';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream-dark border-b-[3px] border-ink flex items-center justify-between px-4 sm:px-6 h-16 shadow-sm">
      <Link href="/">
        <div className="cursor-pointer group flex items-center">
          <Logo size={40} className="group-hover:scale-105 transition-transform" />
        </div>
      </Link>
      <Link href="/about">
        <div className="cursor-pointer hover:rotate-12 transition-transform duration-300">
          <Pip size={36} />
        </div>
      </Link>
    </header>
  );
}
