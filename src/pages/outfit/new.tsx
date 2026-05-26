import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface AvailableItem {
  id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
}

export default function NewOutfitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "followers" | "private">("public");
  const [available, setAvailable] = useState<AvailableItem[]>([]);
  const [selected, setSelected] = useState<AvailableItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/recommendations?userId=seed&type=items")
      .then(r => r.json())
      .then(data => setAvailable(data.map((d: { id: string; name: string; image?: string; price?: number; metadata?: Record<string, unknown> }) => ({
        id: d.id,
        name: d.name,
        images: d.image ? [d.image] : [],
        price: d.price ?? 0,
        category: "ropa",
      }))))
      .catch(() => {});
  }, []);

  const toggleItem = (item: AvailableItem) => {
    setSelected(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleSave = async () => {
    if (!name || selected.length === 0) return;
    setSaving(true);

    const userId = localStorage.getItem("moda_user_id") || "anonymous";

    try {
      const res = await fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          description,
          privacy,
          items: selected.map(i => ({
            itemId: i.id,
            name: i.name,
            image: i.images[0] ?? "",
            category: i.category,
          })),
        }),
      });
      if (res.ok) {
        router.push("/profile");
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg">
      <header className="fixed top-0 w-full z-50 bg-sand-bg h-20 border-b border-outline-variant">
        <div className="flex justify-between items-center w-full px-5 md:px-6 max-w-[1280px] mx-auto h-full">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-on-surface-variant hover:text-ink-black">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-label-caps uppercase tracking-widest">Volver</span>
          </button>
          <span className="text-lg font-semibold">Nuevo Outfit</span>
          <button
            onClick={handleSave}
            disabled={!name || selected.length === 0 || saving}
            className="px-6 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest disabled:opacity-30"
          >
            {saving ? "Guardando..." : "Publicar"}
          </button>
        </div>
      </header>

      <main className="pt-20 pb-12 max-w-[800px] mx-auto px-5">
        <div className="space-y-6 mb-8">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del outfit"
            className="w-full text-headline-md bg-transparent border-b border-outline-variant pb-3 focus:border-ink-black focus:outline-none placeholder:text-on-surface-variant"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full text-body-md bg-transparent border-b border-outline-variant pb-3 focus:border-ink-black focus:outline-none placeholder:text-on-surface-variant resize-none"
          />
          <div className="flex gap-4">
            {(["public", "followers", "private"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPrivacy(p)}
                className={`px-4 py-2 text-label-caps uppercase tracking-widest border transition-colors ${
                  privacy === p
                    ? "border-ink-black bg-ink-black text-white"
                    : "border-outline-variant text-on-surface-variant hover:border-ink-black"
                }`}
              >
                {p === "public" ? "Público" : p === "followers" ? "Seguidores" : "Privado"}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-outline-variant pt-6">
          <h3 className="text-label-caps uppercase tracking-widest text-on-surface-variant mb-4">
            Selecciona prendas ({selected.length} seleccionadas)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {available.map(item => {
              const isSelected = selected.find(i => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`group text-left transition-all ${
                    isSelected ? "ring-2 ring-ink-black" : "hover:ring-1 hover:ring-outline-variant"
                  }`}
                >
                  <div className="aspect-[3/4] bg-surface-container overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-body-md font-medium truncate">{item.name}</p>
                    <p className="text-label-caps text-on-surface-variant">C${item.price.toFixed(2)}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-ink-black text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
