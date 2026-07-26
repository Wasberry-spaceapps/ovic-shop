import { Pip } from './Pip';
import settings from '@/content/settings.json';

export interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 48, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Pip size={size} />
      <div className="flex flex-col relative pt-1">
        <span className="font-display font-semibold leading-none tracking-wide text-ink" style={{ fontSize: size * 0.55 }}>
          {settings.storeName}
        </span>
        <svg aria-hidden="true" width="100%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-1 left-0 mt-1">
          <path
            d="M0,4 Q10,0 20,4 T40,4 T60,4 T80,4 T100,4"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
