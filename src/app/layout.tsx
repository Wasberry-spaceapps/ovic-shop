import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Ovic Bookstore',
  description: 'Welcome to Ovic Bookstore — your cozy neighborhood bookshop.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col relative overflow-x-hidden bg-cream selection:bg-coral selection:text-cream">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="w-full py-8 text-center text-ink-light text-sm font-sans mt-auto">
          <p>
            Made with love &lt;3 | <a href="/social-frames/index.html" className="opacity-50 hover:opacity-100 transition-opacity">Social Frames</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
