import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getUserId } from "@/infrastructure/demo/demoMode";
import { apiGet } from "@/infrastructure/web/lib/apiClient";

type FeedTab = "discover" | "following";

interface FeedItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  metadata?: {
    userId: string;
    userDisplayName?: string;
    userPhotoURL?: string;
    likes: number;
    items: Array<{ itemId: string; name: string; image: string }>;
    createdAt: string;
  };
}

export default function FeedPage() {
  const router = useRouter();
  const [tab, setTab] = useState<FeedTab>("discover");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      const userId = getUserId();
      try {
        const res = await apiGet("/api/feed", { userId, type: tab });
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [tab]);

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar />

      <main className="pt-24 pb-24 max-w-[680px] mx-auto px-5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6 border-b border-outline-variant">
            <button
              onClick={() => setTab("discover")}
              className={`pb-4 text-label-caps uppercase tracking-widest ${
                tab === "discover" ? "border-b-2 border-ink-black text-ink-black" : "text-on-surface-variant"
              }`}
            >
              Descubrir
            </button>
            <button
              onClick={() => setTab("following")}
              className={`pb-4 text-label-caps uppercase tracking-widest ${
                tab === "following" ? "border-b-2 border-ink-black text-ink-black" : "text-on-surface-variant"
              }`}
            >
              Siguiendo
            </button>
          </div>
          <Link
            href="/outfit/new"
            className="px-4 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest text-sm hover:bg-on-primary-fixed-variant transition-colors"
          >
            + Outfit
          </Link>
        </div>
        {loading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-surface-container w-1/3 mb-4" />
                <div className="aspect-[4/3] bg-surface-container mb-4" />
                <div className="h-4 bg-surface-container w-3/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">rss_feed</span>
            <h3 className="text-headline-md mb-2">
              {tab === "following" ? "No hay outfits aún" : "No se encontraron outfits"}
            </h3>
            <p className="text-body-md text-on-surface-variant">
              {tab === "following"
                ? "Sigue a otros usuarios para ver sus outfits aquí."
                : "Explora y descubre nuevos estilos."}
            </p>
            {tab === "following" && (
              <button
                onClick={() => setTab("discover")}
                className="mt-4 px-6 py-3 bg-ink-black text-white text-label-caps uppercase tracking-widest"
              >
                Descubrir
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {items.map(item => (
              <div key={item.id} className="border-b border-outline-variant pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
                    {item.metadata?.userPhotoURL ? (
                      <img src={item.metadata.userPhotoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">👤</div>
                    )}
                  </div>
                  <div>
                    <p className="text-body-md font-medium">{item.metadata?.userDisplayName ?? "Usuario"}</p>
                    <p className="text-label-caps text-on-surface-variant">
                      {new Date(item.metadata?.createdAt ?? "").toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h3 className="text-headline-md mb-2">{item.name}</h3>
                <p className="text-body-md text-on-surface-variant mb-4">{item.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {item.metadata?.items?.slice(0, 4).map((i, idx) => (
                    <div key={idx} className="aspect-square bg-surface-container overflow-hidden">
                      <img src={i.image} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-on-surface-variant">
                  <button className="flex items-center gap-1 hover:text-ink-black transition-colors">
                    <span className="material-symbols-outlined">favorite</span>
                    <span className="text-label-caps">{item.metadata?.likes ?? 0}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-ink-black transition-colors">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-ink-black transition-colors">
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
