import Link from "next/link";
import { useRouter } from "next/router";
import CatLogo from "@/components/CatLogo";
import type { ReactNode } from "react";

interface NavbarProps {
  activeTab?: "ropa" | "eventos" | "promociones";
  onTabChange?: (tab: "ropa" | "eventos" | "promociones") => void;
  showTabs?: boolean;
  rightSlot?: ReactNode;
  title?: string;
  showBack?: boolean;
  hideBottomNav?: boolean;
  navLinks?: Array<{ href: string; label: string }>;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/feed", label: "Feed" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/settings", label: "Ajustes" },
];

const BOTTOM_LINKS = [
  { href: "/feed", icon: "grid_view", label: "Feed", fill: true },
  { href: "/dashboard", icon: "explore", label: "Tienda", fill: false },
  { href: "/outfit/new", icon: "add_circle", label: "Outfit", fill: false },
  { href: "/profile", icon: "person", label: "Perfil", fill: false },
];

const TABS = [
  { key: "ropa" as const, label: "Ropa" },
  { key: "eventos" as const, label: "Eventos" },
  { key: "promociones" as const, label: "Promociones" },
];

export default function Navbar({
  activeTab,
  onTabChange,
  showTabs,
  rightSlot,
  title,
  showBack,
  hideBottomNav,
  navLinks,
}: NavbarProps) {
  const router = useRouter();
  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-sand-bg h-20 border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-full">
          <div className="flex items-center gap-2 md:gap-4">
            {showBack && (
              <button onClick={() => router.back()} className="material-symbols-outlined text-ink-black text-2xl md:text-3xl">
                arrow_back
              </button>
            )}
            <Link href="/" className="flex items-center gap-1.5 md:gap-2">
              <CatLogo size={28} className="md:hidden" />
              <CatLogo size={32} className="hidden md:block" />
              <span className="text-[28px] md:text-[32px] font-semibold leading-none tracking-tight text-ink-black">NEKOMODA</span>
            </Link>
          </div>

          {!title && (
            <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
              {(navLinks ?? (showTabs ? [] : NAV_LINKS)).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-label-caps uppercase tracking-[0.1em] pb-1 transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-ink-black border-b-2 border-ink-black"
                      : "text-on-surface-variant hover:text-ink-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {showTabs && TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange?.(tab.key)}
                  className={`text-label-caps uppercase tracking-[0.1em] pb-1 transition-all duration-300 ${
                    activeTab === tab.key
                      ? "text-ink-black border-b-2 border-ink-black"
                      : "text-on-surface-variant hover:text-ink-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}

          {title && (
            <span className="text-body-lg font-semibold text-ink-black hidden md:block">{title}</span>
          )}

          <div className="flex items-center gap-3 md:gap-4">
            {rightSlot}
            <button
              onClick={() => router.push("/profile")}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-surface-container overflow-hidden flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-ink-black text-xl md:text-2xl">person</span>
            </button>
          </div>
        </div>
      </header>

      {showTabs && (
        <section className="md:hidden px-5 overflow-x-auto no-scrollbar mt-20">
          <div className="flex gap-6 whitespace-nowrap border-b border-outline-variant">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange?.(tab.key)}
                className={`pb-4 pt-4 text-label-caps ${
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

      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container-lowest md:hidden rounded-t-xl shadow-sm">
          {BOTTOM_LINKS.map(link => {
            const isCurrent = isActive(link.href);
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex flex-col items-center transition-transform active:scale-95 ${
                  isCurrent ? "text-ink-black font-bold" : "text-on-surface-variant"
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={link.fill && isCurrent ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span className="text-[10px] mt-0.5 uppercase tracking-[0.1em] font-semibold">{link.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
