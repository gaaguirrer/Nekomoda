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
      <ellipse cx="32" cy="37" rx="16" ry="14" className="fill-ink-black/90" />
      <ellipse cx="20" cy="16" rx="6" ry="10" className="fill-ink-black/90" transform="rotate(-20 20 16)" />
      <ellipse cx="44" cy="16" rx="6" ry="10" className="fill-ink-black/90" transform="rotate(20 44 16)" />
      <ellipse cx="24" cy="36" rx="3" ry="3.5" className="fill-sand-bg" />
      <ellipse cx="40" cy="36" rx="3" ry="3.5" className="fill-sand-bg" />
      <circle cx="25" cy="35" r="1.8" className="fill-ink-black" />
      <circle cx="39" cy="35" r="1.8" className="fill-ink-black" />
      <circle cx="26" cy="34" r="0.6" className="fill-white" />
      <circle cx="40" cy="34" r="0.6" className="fill-white" />
      <ellipse cx="32" cy="41" rx="2.5" ry="1.5" className="fill-primary-pink" />
      <path d="M29 43 Q32 46 35 43" className="stroke-ink-black" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="24" y1="42" x2="20" y2="48" className="stroke-ink-black/80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="42" x2="44" y2="48" className="stroke-ink-black/80" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
