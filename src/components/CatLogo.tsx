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
      <polygon points="10,40 35,10 45,35" fill="#1C1C1C" />
      <polygon points="90,40 65,10 55,35" fill="#1C1C1C" />
      <circle cx="50" cy="55" r="35" fill="#1C1C1C" />
      <polygon points="50,70 30,30 70,30" fill="#F9F9F7" />
      <polygon points="50,30 38,30 45,45" fill="#1C1C1C" />
      <ellipse cx="37" cy="48" rx="7" ry="8" fill="#F9F9F7" />
      <ellipse cx="63" cy="48" rx="7" ry="8" fill="#F9F9F7" />
      <circle cx="37" cy="48" r="5" fill="#1C1C1C" />
      <circle cx="63" cy="48" r="5" fill="#1C1C1C" />
      <circle cx="35" cy="46" r="1.8" fill="#F9F9F7" />
      <circle cx="61" cy="46" r="1.8" fill="#F9F9F7" />
      <polygon points="47,60 53,60 50,65" fill="#1C1C1C" />
      <path d="M 50 65 Q 45 70 40 68 M 50 65 Q 55 70 60 68" stroke="#1C1C1C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="30" y1="62" x2="15" y2="58" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="65" x2="15" y2="65" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="62" x2="85" y2="58" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="70" y1="65" x2="85" y2="65" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
