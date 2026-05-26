import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import { apiGet, apiPost } from "@/infrastructure/web/lib/apiClient";
import { getUserId } from "@/infrastructure/demo/demoMode";
import { categoryLabels } from "@/infrastructure/firebase/seedData";

interface FavItem {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = getUserId();
      try {
        const res = await apiGet("/api/favorites", { userId });
        if (res.ok) {
          const data = await res.json();
          setItems(data.items ?? []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (itemId: string) => {
    const userId = getUserId();
    const res = await apiPost("/api/favorites", { userId, itemId });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar />

      <main className="pt-24 pb-24 max-w-[1280px] mx-auto px-5">
        <h1 className="text-display-lg-mobile md:text-display-lg mb-2">Mis Favoritos</h1>
        <p className="text-body-lg text-on-surface-variant mb-10">
          {loading ? "" : `${items.length} producto${items.length !== 1 ? "s" : ""} guardado${items.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-surface-container mb-3" />
                <div className="h-4 bg-surface-container w-3/4 mb-2" />
                <div className="h-4 bg-surface-container w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">favorite</span>
            <h2 className="text-headline-md mb-2">No tienes favoritos aún</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Explora productos y agrega tus favoritos aquí.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.id} className="relative group">
                <ItemCard
                  name={item.name}
                  price={item.price}
                  image={item.images?.[0] ?? ""}
                  matchScore={100}
                  categoryLabel={categoryLabels[item.category] ?? ""}
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-red-500 text-lg">favorite</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
