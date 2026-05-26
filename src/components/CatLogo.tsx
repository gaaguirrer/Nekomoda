interface CatLogoProps {
  size?: number;
  className?: string;
}

export default function CatLogo({ size = 32, className = "" }: CatLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Nekomoda cat"
    >
      <polygon points="16,30 20,11 26,26" className="fill-ink-black/90" />
      <polygon points="38,26 44,11 48,30" className="fill-ink-black/90" />
      <polygon points="18,27 21,15 25,24" className="fill-primary-pink" />
      <polygon points="39,24 43,15 46,27" className="fill-primary-pink" />
      <ellipse cx="32" cy="36" rx="15" ry="13" className="fill-ink-black/90" />
      <ellipse cx="24" cy="34" rx="3.5" ry="3.5" className="fill-sand-bg" />
      <ellipse cx="40" cy="34" rx="3.5" ry="3.5" className="fill-sand-bg" />
      <circle cx="25" cy="33" r="2" className="fill-ink-black" />
      <circle cx="39" cy="33" r="2" className="fill-ink-black" />
      <circle cx="26.5" cy="32" r="0.8" className="fill-white" />
      <circle cx="40.5" cy="32" r="0.8" className="fill-white" />
      <ellipse cx="32" cy="39.5" rx="2.5" ry="1.5" className="fill-primary-pink" />
      <path d="M29 41.5 Q32 44.5 35 41.5" className="stroke-ink-black" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="17" y1="37" x2="7" y2="35" className="stroke-ink-black/60" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="17" y1="39" x2="7" y2="39.5" className="stroke-ink-black/60" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="47" y1="37" x2="57" y2="35" className="stroke-ink-black/60" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="47" y1="39" x2="57" y2="39.5" className="stroke-ink-black/60" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
