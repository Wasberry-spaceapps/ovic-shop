import { Pip } from '@/components/Pip';
import { Breadcrumb } from '@/components/Breadcrumb';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import registry from '@/content/registry.json';

export const metadata = {
  title: 'Contact — Ovic Bookstore',
  description: 'Get in touch with Ovic Bookstore.',
};

export default function ContactPage() {
  const { fields } = registry.contact;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb href="/" label="Home" />

      <div className="flex flex-col items-center text-center mb-12">
        <Pip size={120} wave />
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mt-6 mb-4">
          {fields.heading}
        </h1>
        <div className="flex justify-center mb-8">
          <svg aria-hidden="true" width="120" height="20" viewBox="0 0 120 20" fill="none">
            <path d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10" stroke="var(--coral)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="bg-cream-dark border-[3px] border-ink rounded-[24px] p-8 sm:p-12 flex flex-col items-center gap-8" style={{ boxShadow: 'var(--shadow-cartoon)' }}>
        <p className="font-sans text-ink text-lg leading-relaxed text-center max-w-lg">
          {fields.intro}
        </p>
        <WhatsAppButton bookTitle="General Inquiry" />
      </div>
    </div>
  );
}
