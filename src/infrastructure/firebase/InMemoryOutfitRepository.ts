import { IOutfitRepository } from "@/domain/ports/IOutfitRepository";
import { Outfit } from "@/domain/entities/Outfit";
import { seedOutfits } from "./seedSocialData";

let store = [...seedOutfits];

export function resetOutfitStore() {
  store = [...seedOutfits];
}

export class InMemoryOutfitRepository implements IOutfitRepository {
  async getAll(): Promise<Outfit[]> {
    return [...store];
  }

  async getById(id: string): Promise<Outfit | null> {
    return store.find(o => o.id === id) ?? null;
  }

  async getByUserId(userId: string): Promise<Outfit[]> {
    return store.filter(o => o.userId === userId);
  }

  async getPublic(): Promise<Outfit[]> {
    return store.filter(o => o.privacy === "public").sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getFeed(userId: string, followingIds: string[]): Promise<Outfit[]> {
    const visible = store.filter(o =>
      o.privacy === "public" || (o.privacy === "followers" && followingIds.includes(o.userId))
    );
    return visible.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
  }

  async save(outfit: Outfit): Promise<void> {
    const idx = store.findIndex(o => o.id === outfit.id);
    if (idx >= 0) {
      store[idx] = outfit;
    } else {
      store.push(outfit);
    }
  }

  async update(id: string, data: Partial<Outfit>): Promise<void> {
    const idx = store.findIndex(o => o.id === id);
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
    }
  }

  async delete(id: string): Promise<void> {
    store = store.filter(o => o.id !== id);
  }

  async like(outfitId: string, userId: string): Promise<void> {
    const outfit = store.find(o => o.id === outfitId);
    if (outfit && !outfit.likedBy.includes(userId)) {
      outfit.likedBy.push(userId);
      outfit.likes = outfit.likedBy.length;
    }
  }

  async unlike(outfitId: string, userId: string): Promise<void> {
    const outfit = store.find(o => o.id === outfitId);
    if (outfit) {
      outfit.likedBy = outfit.likedBy.filter(id => id !== userId);
      outfit.likes = outfit.likedBy.length;
    }
  }
}
