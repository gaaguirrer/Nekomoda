import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import EmptyState from "@/components/EmptyState";
import { fetchRecommendations } from "@/infrastructure/web/lib/recommendations";
import { getOrCreateUserId } from "@/infrastructure/web/lib/userId";
import type { RecommendationDTO } from "@/application/dto/RecommendationDTO";

type TabType = "ropa" | "eventos" | "promociones";

interface State {
  loading: boolean;
  error: string | null;
  noProfile: boolean;
  items: RecommendationDTO[];
  events: RecommendationDTO[];
  promotions: RecommendationDTO[];
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; items: RecommendationDTO[]; events: RecommendationDTO[]; promotions: RecommendationDTO[] }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "NO_PROFILE" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, noProfile: false };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.items, events: action.events, promotions: action.promotions };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.message };
    case "NO_PROFILE":
      return { ...state, loading: false, noProfile: true };
    default:
      return state;
  }
}

const initialState: State = {
  loading: true,
  error: null,
  noProfile: false,
  items: [],
  events: [],
  promotions: [],
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("ropa");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_START" });

      const userId = getOrCreateUserId();

      try {
        const [itemData, eventData, promoData] = await Promise.all([
          fetchRecommendations(userId, "items").catch(() => [] as RecommendationDTO[]),
          fetchRecommendations(userId, "events").catch(() => [] as RecommendationDTO[]),
          fetchRecommendations(userId, "promotions").catch(() => [] as RecommendationDTO[]),
        ]);

        dispatch({ type: "FETCH_SUCCESS", items: itemData, events: eventData, promotions: promoData });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al cargar recomendaciones";
        if (msg.includes("Complete onboarding")) {
          dispatch({ type: "NO_PROFILE" });
        } else {
          dispatch({ type: "FETCH_ERROR", message: msg });
        }
      }
    };

    fetchData();
  }, [retryCount]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  if (state.noProfile) {
    return (
      <div className="min-h-screen bg-sand-bg flex flex-col items-center justify-center px-5 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-6">person_outline</span>
        <h1 className="text-display-lg-mobile md:text-display-lg mb-4">Bienvenido a MODA</h1>
        <p className="text-body-lg text-on-surface-variant max-w-md mb-8">
          Cuéntanos sobre tu estilo para obtener recomendaciones personalizadas.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-4 bg-ink-black text-surface-bright text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors"
        >
          Comenzar Test de Estilo
        </button>
      </div>
    );
  }

  const renderContent = () => {
    if (state.loading) return <SkeletonLoader />;

    if (state.error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-5xl text-error mb-4">error_outline</span>
          <p className="text-body-lg text-on-surface-variant mb-4">{state.error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-ink-black text-surface-bright text-label-caps uppercase tracking-widest hover:bg-on-primary-fixed-variant transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case "ropa":
        return state.items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {state.items.map((item, i) => (
              <ItemCard
                key={item.id}
                name={item.name}
                price={item.price ?? 0}
                image={item.image ?? ""}
                matchScore={item.matchScore}
                isTopMatch={i === 0 && item.matchScore >= 95}
              />
            ))}
          </div>
        );

      case "eventos":
        return state.events.length === 0 ? (
          <EmptyState message="No hay eventos próximos que coincidan con tu perfil." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {state.events.map((event, i) => {
              const date = event.metadata?.date as string | undefined;
              const location = event.metadata?.location as string | undefined;

              if (i === 0) {
                return (
                  <div key={event.id} className="md:col-span-8 group cursor-pointer">
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-container mb-4">
                      {event.image && (
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={event.image}
                          alt={event.name}
                          loading="lazy"
                        />
                      )}
                      <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-[8px] px-3 py-1 rounded-full">
                        <span className="text-label-caps text-ink-black">{event.matchScore}% COINCIDENCIA</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-label-caps text-secondary uppercase tracking-widest mb-2 block">Evento Exclusivo</span>
                        <h3 className="text-headline-md mb-1">{event.name}</h3>
                        <p className="text-body-md text-on-surface-variant">{date}{location ? ` • ${location}` : ""}</p>
                      </div>
                      <button className="bg-ink-black text-white px-6 py-3 text-label-caps uppercase hover:bg-on-primary-container transition-colors">
                        Asistir
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={event.id} className="md:col-span-4 group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container mb-2">
                    {event.image && (
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={event.image}
                        alt={event.name}
                        loading="lazy"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-white/70 backdrop-blur-[8px] px-2 py-0.5 rounded-full">
                      <span className="text-label-caps text-ink-black">{event.matchScore}%</span>
                    </div>
                  </div>
                  <h4 className="text-body-md font-bold">{event.name}</h4>
                  <p className="text-label-caps text-on-surface-variant">{date}{location ? ` • ${location}` : ""}</p>
                </div>
              );
            })}
          </div>
        );

      case "promociones":
        return state.promotions.length === 0 ? (
          <EmptyState message="No hay promociones disponibles para tu perfil en este momento." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.promotions.map((promo) => {
              const discount = promo.metadata?.discount as number | undefined;
              const code = promo.metadata?.code as string | undefined;
              const expiresAt = promo.metadata?.expiresAt as string | undefined;
              const isDark = promo.matchScore >= 90;

              return (
                <div
                  key={promo.id}
                  className={`relative group cursor-pointer p-6 border ${
                    isDark
                      ? "bg-ink-black text-white border-transparent"
                      : "bg-white border-outline-variant"
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className={`text-display-lg ${isDark ? "text-surface-bright" : "text-coral-vibrant"}`}>
                      {discount ? `-${discount}%` : "VIP"}
                    </span>
                    <div className={`px-3 py-1 rounded-full border ${isDark ? "bg-white/10" : "bg-white/70 border-ink-black/10"}`}>
                      <span className="text-label-caps">{promo.matchScore}% MATCH</span>
                    </div>
                  </div>
                  <div className="mb-8">
                    <h3 className="text-headline-md mb-1 uppercase tracking-tight">{promo.name}</h3>
                    <p className={`text-body-md ${isDark ? "text-surface-dim" : "text-on-surface-variant"}`}>
                      {promo.description}
                    </p>
                  </div>
                  <div className={`border-t pt-4 flex justify-between items-center ${isDark ? "border-white/20" : "border-outline-variant"}`}>
                    <span className="text-label-caps uppercase">{code ? `CÓDIGO: ${code}` : "Promoción Exclusiva"}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                  {expiresAt && (
                    <p className={`text-label-caps mt-2 ${isDark ? "text-coral-muted" : "text-secondary"}`}>
                      Vence: {new Date(expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} showTabs />

      <main className="pt-20 pb-24 md:pb-12">
        <section className="px-5 md:px-6 max-w-[1280px] mx-auto mt-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <span className="text-label-caps uppercase text-on-surface-variant mb-4 block">CURATED FOR YOU</span>
              <h1 className="text-display-lg-mobile md:text-display-lg leading-tight mb-6">
                Hola, esto es para ti
              </h1>
              <p className="text-body-lg max-w-xl text-on-surface-variant">
                Nuestra selección inteligente utiliza algoritmos avanzados para encontrar piezas que resuenan con tu identidad visual única.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <div className="text-right">
                <div className="text-display-lg-mobile text-coral-vibrant mb-0">
                  {state.loading ? "--" : `${Math.max(...[...state.items, ...state.events, ...state.promotions].map(r => r.matchScore), 0)}%`}
                </div>
                <div className="text-label-caps uppercase text-on-surface-variant">Match de Estilo</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 md:px-6 max-w-[1280px] mx-auto mb-20">
          {renderContent()}
        </section>
      </main>

      <button className="fixed bottom-24 right-6 bg-ink-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg md:hidden z-40">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
      </button>
    </div>
  );
}
