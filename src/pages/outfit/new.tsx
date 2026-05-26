import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { apiGet, apiPost } from "@/infrastructure/web/lib/apiClient";
import { getUserId } from "@/infrastructure/demo/demoMode";

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
    apiGet("/api/products")
      .then(r => r.json())
      .then(data => {
        if (data.items) {
          setAvailable(data.items.map((i: { id: string; name: string; images: string[]; price: number; category: string }) => ({
            id: i.id,
            name: i.name,
            images: i.images ?? [],
            price: i.price ?? 0,
            category: i.category,
          })));
        }
      })
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

    const userId = getUserId();

    try {
      const res = await apiPost("/api/outfits", {
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
      });
      if (res.ok) {
        router.push("/profile");
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar
        showBack
        title="Nuevo Outfit"
        rightSlot={
          <button
            onClick={handleSave}
            disabled={!name || selected.length === 0 || saving}
            className="px-4 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest text-sm disabled:opacity-30 hover:bg-on-primary-fixed-variant transition-colors"
          >
            {saving ? "Guardando..." : "Publicar"}
          </button>
        }
      />

      <main className="pt-24 pb-24 max-w-[800px] mx-auto px-5">
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
                  className={`group text-left transition-all relative ${
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
