import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ItemCard from "@/components/ItemCard";

interface Product {
  id: string; name: string; price: number; image: string; matchScore: number;
}

interface OutfitPreview {
  id: string; name: string; description: string; image: string; userDisplayName?: string; likes: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<OutfitPreview[]>([]);
  const [user, setUser] = useState<{ displayName?: string } | null>(null);

  useEffect(() => {
    fetch("/api/recommendations?userId=seed&type=items")
      .then(r => r.json())
      .then(data => setProducts(data.slice(0, 8)))
      .catch(() => {});

    fetch("/api/feed?userId=seed&type=discover")
      .then(r => r.json())
      .then(data => {
        const outfits = (data as Array<{ id: string; name: string; description: string; image?: string; metadata?: Record<string, unknown> }>).slice(0, 4);
        setCollections(outfits.map(o => ({
          id: o.id,
          name: o.name,
          description: o.description,
          image: o.image ?? "",
          userDisplayName: (o.metadata?.userDisplayName as string) ?? "Usuario",
          likes: (o.metadata?.likes as number) ?? 0,
        })));
      })
      .catch(() => {});

    const stored = localStorage.getItem("moda_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-sand-bg">
      <header className="fixed top-0 w-full z-50 bg-sand-bg/95 backdrop-blur-sm h-20 border-b border-outline-variant/50">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-full">
          <span className="text-[36px] md:text-[48px] font-semibold tracking-tight text-ink-black">MODA</span>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#productos" className="text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-ink-black transition-colors">Productos</Link>
            <Link href="/#colecciones" className="text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-ink-black transition-colors">Colecciones</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-ink-black transition-colors">Dashboard</Link>
                <Link href="/settings" className="text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-ink-black transition-colors">Ajustes</Link>
                <button onClick={() => router.push("/profile")} className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                  <span className="material-symbols-outlined text-ink-black text-2xl">person</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2 border border-ink-black text-ink-black text-label-caps uppercase tracking-widest hover:bg-ink-black hover:text-white transition-colors">Entrar</Link>
                <Link href="/register" className="px-5 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors">Registro</Link>
              </>
            )}
          </nav>
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn ? (
              <button onClick={() => router.push("/dashboard")} className="w-8 h-8 rounded-full bg-surface-container overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-ink-black">person</span>
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest text-xs">Entrar</Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 md:pb-32 px-5 md:px-6 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-label-caps uppercase tracking-widest text-coral-vibrant mb-4 block">MODA — Personal Shopping IA</span>
              <h1 className="text-display-lg-mobile md:text-display-lg leading-tight mb-6 text-ink-black">
                Descubre tu estilo con inteligencia artificial
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg mb-8">
                Respondes 5 preguntas sobre tus gustos y nuestro algoritmo encuentra las prendas, eventos y promociones perfectas para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest text-center hover:bg-on-primary-fixed-variant transition-colors">
                    Ir al Dashboard
                  </Link>
                ) : (
                  <Link href="/register" className="px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest text-center hover:bg-on-primary-fixed-variant transition-colors">
                    Comenzar Ahora
                  </Link>
                )}
                <Link href="/#productos" className="px-8 py-4 border border-outline-variant text-ink-black text-label-caps uppercase tracking-widest text-center hover:border-ink-black transition-colors">
                  Explorar Productos
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] md:aspect-auto md:h-[600px] bg-surface-container overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"
                alt="Fashion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand-bg/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4">
                <p className="text-body-md font-medium">Chaqueta Cuero 'Clásica'</p>
                <p className="text-price-tag text-coral-vibrant">€680</p>
              </div>
            </div>
          </div>
        </section>

        <section id="productos" className="py-16 md:py-24 px-5 md:px-6 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-label-caps uppercase tracking-widest text-on-surface-variant mb-2 block">Catálogo</span>
              <h2 className="text-headline-md md:text-display-lg-mobile">Productos Destacados</h2>
            </div>
            {isLoggedIn && (
              <Link href="/dashboard" className="text-label-caps uppercase tracking-widest text-ink-black border-b border-ink-black pb-0.5">
                Ver todos →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-surface-container mb-4" />
                  <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                  <div className="h-4 bg-surface-container rounded w-1/4" />
                </div>
              ))
            ) : (
              products.map((p, i) => (
                <ItemCard
                  key={p.id}
                  name={p.name}
                  price={p.price}
                  image={p.image}
                  matchScore={p.matchScore}
                  isTopMatch={i === 0}
                />
              ))
            )}
          </div>
        </section>

        <section id="colecciones" className="py-16 md:py-24 px-5 md:px-6 max-w-[1280px] mx-auto bg-surface-container-low -mx-5 md:-mx-6 md:px-6">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-label-caps uppercase tracking-widest text-on-surface-variant mb-2 block">Comunidad</span>
                <h2 className="text-headline-md md:text-display-lg-mobile">Colecciones Populares</h2>
              </div>
              <Link href="/feed" className="text-label-caps uppercase tracking-widest text-ink-black border-b border-ink-black pb-0.5">
                Explorar todo →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-surface-container mb-4" />
                    <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
                    <div className="h-3 bg-surface-container rounded w-1/2" />
                  </div>
                ))
              ) : (
                collections.map(col => (
                  <Link key={col.id} href="/feed" className="group cursor-pointer">
                    <div className="aspect-[4/3] bg-surface-container overflow-hidden mb-3">
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-body-md font-medium">{col.name}</h3>
                    <p className="text-label-caps text-on-surface-variant">{col.userDisplayName} · {col.likes} likes</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-5 md:px-6 max-w-[1280px] mx-auto text-center">
          <h2 className="text-display-lg-mobile md:text-display-lg mb-4">¿Listo para transformar tu estilo?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-8">
            {isLoggedIn ? "Completa tu perfil de estilo y recibe recomendaciones hechas a tu medida." : "Regístrate gratis, responde 5 preguntas y descubre un mundo de moda personalizada."}
          </p>
          {isLoggedIn ? (
            <Link href="/onboarding" className="inline-block px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors">
              {user?.displayName ? `Hola ${user.displayName}, tu estilo →` : "Mi Perfil de Estilo →"}
            </Link>
          ) : (
            <Link href="/register" className="inline-block px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors">
              Crear Cuenta Gratis
            </Link>
          )}
        </section>
      </main>

      <footer className="border-t border-outline-variant py-8 px-5 md:px-6">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <span className="text-lg font-semibold tracking-tight">MODA</span>
          <p className="text-label-caps text-on-surface-variant">© 2026 MODA — Personal Shopping con IA</p>
        </div>
      </footer>
    </div>
  );
}
