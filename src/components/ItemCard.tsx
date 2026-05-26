interface ItemCardProps {
  name: string;
  price: number;
  image: string;
  matchScore: number;
  isTopMatch?: boolean;
  categoryLabel?: string;
}

const categoryColors: Record<string, string> = {
  "Parte Superior": "bg-sky-100 text-sky-800",
  "Parte Inferior": "bg-amber-100 text-amber-800",
  Vestidos: "bg-rose-100 text-rose-800",
  Calzado: "bg-emerald-100 text-emerald-800",
  Accesorios: "bg-violet-100 text-violet-800",
};

export default function ItemCard({ name, price, image, matchScore, isTopMatch, categoryLabel }: ItemCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container mb-4">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={image}
          alt={name}
          loading="lazy"
        />
        {categoryLabel && (
          <span className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-label-caps text-[11px] ${categoryColors[categoryLabel] ?? "bg-white/70 text-ink-black"}`}>
            {categoryLabel}
          </span>
        )}
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 ${
            isTopMatch
              ? "bg-coral-vibrant"
              : "bg-white/70 backdrop-blur-[8px]"
          }`}
        >
          <span className={`text-label-caps ${isTopMatch ? "text-white" : "text-ink-black"}`}>
            {isTopMatch ? "99% TOP MATCH" : `${matchScore}% MATCH`}
          </span>
        </div>
        <button className="absolute bottom-4 right-4 bg-ink-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <h3 className="text-body-md font-medium text-ink-black">{name}</h3>
      <p className="text-price-tag text-on-surface-variant">C${price.toFixed(2)}</p>
    </div>
  );
}
