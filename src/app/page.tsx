import { BubbleNav } from '@/components/BubbleNav';
import { Pip } from '@/components/Pip';
import registry from '@/content/registry.json';

export default function Home() {
  return (
    <div className="w-full min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative background watermark Pip */}
      <div className="absolute -bottom-10 -right-10 opacity-[0.05] pointer-events-none z-0 rotate-[-10deg]">
        <Pip size={400} />
      </div>

      <div className="z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-12 relative text-center">
          {registry.home.fields.heroHeading}
        </h1>
        <BubbleNav />
      </div>
    </div>
  );
}
