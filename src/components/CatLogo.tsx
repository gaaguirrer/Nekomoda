interface CatLogoProps {
  size?: number;
  className?: string;
}

export default function CatLogo({ size = 32, className = "" }: CatLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Nekomoda cat"
    >
      <polygon points="10,40 35,10 45,35" className="fill-ink-black" />
      <polygon points="90,40 65,10 55,35" className="fill-ink-black" />
      <circle cx="50" cy="55" r="35" className="fill-white stroke-ink-black stroke-[1.5]" />
      <polygon points="50,70 35,35 65,35" className="fill-white" />
      <circle cx="50" cy="35" r="8" className="fill-ink-black" />
      <ellipse cx="37" cy="48" rx="7" ry="8" className="fill-ink-black" />
      <ellipse cx="63" cy="48" rx="7" ry="8" className="fill-ink-black" />
      <circle cx="35" cy="46" r="2.5" className="fill-white" />
      <circle cx="61" cy="46" r="2.5" className="fill-white" />
      <polygon points="47,60 53,60 50,65" className="fill-ink-black" />
      <path d="M 50 65 Q 45 70 40 68 M 50 65 Q 55 70 60 68" className="stroke-ink-black stroke-[1.5] fill-none stroke-round" />
      <line x1="30" y1="62" x2="15" y2="58" className="stroke-ink-black stroke-[1.5]" />
      <line x1="30" y1="65" x2="15" y2="65" className="stroke-ink-black stroke-[1.5]" />
      <line x1="70" y1="62" x2="85" y2="58" className="stroke-ink-black stroke-[1.5]" />
      <line x1="70" y1="65" x2="85" y2="65" className="stroke-ink-black stroke-[1.5]" />
    </svg>
  );
}
