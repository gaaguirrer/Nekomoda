import { useEffect } from "react";
import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import CatLogo from "@/components/CatLogo";
import Navbar from "@/components/Navbar";
import { seedItems, categoryLabels } from "@/infrastructure/firebase/seedData";
import { seedCollections } from "@/infrastructure/firebase/seedSocialData";
import { enterDemoMode } from "@/infrastructure/demo/demoMode";

interface Product {
  id: string; name: string; price: number; image: string; matchScore: number; category: string;
}

export default function LandingPage() {
  useEffect(() => {
    enterDemoMode();
  }, []);

  const products: Product[] = seedItems.slice(0, 8).map(i => ({
    id: i.id, name: i.name, price: i.price,
    image: i.images?.[0] ?? "",
    matchScore: 100, category: i.category,
  }));

  const collections = seedCollections.slice(0, 4).map(c => ({
    id: c.id, name: c.name, description: c.description ?? "",
    image: c.coverImage ?? "",
    userDisplayName: c.userDisplayName ?? "Usuario",
    likes: c.likes,
  }));

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar />

      <main>
        <section className="pt-32 pb-20 md:pb-32 px-5 md:px-6 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-label-caps uppercase tracking-widest text-coral-vibrant mb-4 block">NEKOMODA — Personal Shopping IA</span>
              <h1 className="text-display-lg-mobile md:text-display-lg leading-tight mb-6 text-ink-black">
                Descubre tu estilo con inteligencia artificial
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg mb-8">
                Respondes 5 preguntas sobre tus gustos y nuestro algoritmo encuentra las prendas, eventos y promociones perfectas para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest text-center hover:bg-on-primary-fixed-variant transition-colors">
                  Ir al Dashboard
                </Link>
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
                <p className="text-price-tag text-coral-vibrant">C$680</p>
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
            <Link href="/dashboard" className="text-label-caps uppercase tracking-widest text-ink-black border-b border-ink-black pb-0.5">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((p, i) => (
              <ItemCard
                key={p.id}
                name={p.name}
                price={p.price}
                image={p.image}
                matchScore={p.matchScore}
                isTopMatch={i === 0}
                categoryLabel={categoryLabels[p.category] ?? ""}
              />
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low">
          <div id="colecciones" className="py-16 md:py-24 px-5 md:px-6 max-w-[1280px] mx-auto">
            <div className="w-full text-center mb-10">
              <span className="text-label-caps uppercase tracking-widest text-on-surface-variant mb-2 block">Comunidad</span>
              <h2 className="text-headline-md md:text-display-lg-mobile mb-4">Colecciones Populares</h2>
              <Link href="/feed" className="inline-block text-label-caps uppercase tracking-widest text-ink-black border-b border-ink-black pb-0.5">
                Explorar todo →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map(col => (
                <Link key={col.id} href="/feed" className="group cursor-pointer text-center block">
                  <div className="aspect-[4/3] w-full bg-surface-container overflow-hidden mb-3">
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
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-5 md:px-6 max-w-[1280px] mx-auto text-center">
          <h2 className="text-display-lg-mobile md:text-display-lg mb-4">¿Listo para transformar tu estilo?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-8">
            Completa tu perfil de estilo y recibe recomendaciones hechas a tu medida.
          </p>
          <Link href="/onboarding" className="inline-block px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors">
            Mi Perfil de Estilo →
          </Link>
        </section>
      </main>

      <footer className="border-t border-outline-variant py-8 px-5 md:px-6">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CatLogo size={20} />
            <span className="text-lg font-semibold tracking-tight">NEKOMODA</span>
          </div>
          <p className="text-label-caps text-on-surface-variant">© 2026 NEKOMODA — Personal Shopping con IA</p>
        </div>
      </footer>
    </div>
  );
}
