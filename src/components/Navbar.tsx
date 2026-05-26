import Link from "next/link";

interface NavbarProps {
  activeTab?: "ropa" | "eventos" | "promociones";
  onTabChange?: (tab: "ropa" | "eventos" | "promociones") => void;
  showTabs?: boolean;
}

export default function Navbar({ activeTab, onTabChange, showTabs }: NavbarProps) {
  const tabs = [
    { key: "ropa" as const, label: "Ropa" },
    { key: "eventos" as const, label: "Eventos" },
    { key: "promociones" as const, label: "Promociones" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-sand-bg dark:bg-ink-black h-20 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-full">
          <Link href="/" className="text-[36px] md:text-[48px] font-semibold leading-none tracking-tight text-ink-black dark:text-surface-bright">
            MODA
          </Link>
          <nav className="hidden md:flex gap-8 items-center h-full">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange?.(tab.key)}
                className={`text-label-caps uppercase tracking-[0.1em] pb-1 transition-all duration-300 ${
                  activeTab === tab.key
                    ? "text-ink-black dark:text-surface-bright border-b-2 border-ink-black dark:border-surface-bright"
                    : "text-on-surface-variant dark:text-on-primary-fixed-variant hover:text-secondary dark:hover:text-secondary-fixed-dim"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-ink-black dark:text-surface-bright text-2xl">search</span>
            <span className="material-symbols-outlined text-ink-black dark:text-surface-bright text-2xl">person</span>
          </div>
        </div>
      </header>

      {showTabs && (
        <section className="md:hidden px-5 mb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-6 whitespace-nowrap border-b border-outline-variant">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange?.(tab.key)}
                className={`pb-4 text-label-caps ${
                  activeTab === tab.key
                    ? "border-b-2 border-ink-black text-ink-black"
                    : "text-on-surface-variant"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>
      )}

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest dark:bg-ink-black md:hidden rounded-t-xl shadow-sm">
        <button className="flex flex-col items-center text-ink-black dark:text-coral-vibrant font-bold transition-transform active:scale-95">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          <span className="text-[10px] mt-1 uppercase tracking-[0.1em] font-semibold">Feed</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant dark:text-on-primary-fixed-variant transition-transform active:scale-95">
          <span className="material-symbols-outlined text-2xl">search</span>
          <span className="text-[10px] mt-1 uppercase tracking-[0.1em] font-semibold">Explorar</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant dark:text-on-primary-fixed-variant transition-transform active:scale-95">
          <span className="material-symbols-outlined text-2xl">favorite</span>
          <span className="text-[10px] mt-1 uppercase tracking-[0.1em] font-semibold">Guardados</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant dark:text-on-primary-fixed-variant transition-transform active:scale-95">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] mt-1 uppercase tracking-[0.1em] font-semibold">Perfil</span>
        </button>
      </nav>
    </>
  );
}
