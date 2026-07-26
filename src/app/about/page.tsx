import { Pip } from '@/components/Pip';
import { Breadcrumb } from '@/components/Breadcrumb';
import registry from '@/content/registry.json';

export const metadata = {
  title: 'About — Ovic Bookstore',
  description: 'Learn about Ovic Bookstore and our mascot Francesca the owl.',
};

export default function AboutPage() {
  const { fields } = registry.about;
  
  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb href="/" label="Home" />

      <div className="flex flex-col items-center text-center mb-12">
        <Pip size={160} />
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mt-6 mb-4">
          {fields.heading}
        </h1>
        <div className="flex justify-center mb-8">
          <svg aria-hidden="true" width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-dark border-[3px] border-ink rounded-[24px] p-8 sm:p-12 font-sans text-ink leading-[1.8] text-lg" style={{ boxShadow: 'var(--shadow-cartoon)' }}>
        <p className="mb-6">{fields.p1}</p>
        <p className="mb-6">{fields.p2}</p>
        <p>{fields.p3}</p>
      </div>
    </div>
  );
}
