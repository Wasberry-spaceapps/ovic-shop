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
      <div className="flex items-center gap-6">
        <a 
          href="https://blog.ovicbookstore.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-semibold text-ink hover:text-coral transition-colors flex items-center gap-2"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Blog
        </a>
        <Link href="/about">
          <div className="cursor-pointer hover:rotate-12 transition-transform duration-300">
            <Pip size={36} />
          </div>
        </Link>
      </div>
    </header>
  );
}
