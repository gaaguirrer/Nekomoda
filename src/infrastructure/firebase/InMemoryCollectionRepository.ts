import { ICollectionRepository } from "@/domain/ports/ICollectionRepository";
import { Collection } from "@/domain/entities/Collection";
import { seedCollections } from "./seedSocialData";

let store = [...seedCollections];

export function resetCollectionStore() {
  store = [...seedCollections];
}

export class InMemoryCollectionRepository implements ICollectionRepository {
  async getAll(): Promise<Collection[]> {
    return [...store];
  }

  async getById(id: string): Promise<Collection | null> {
    return store.find(c => c.id === id) ?? null;
  }

  async getByUserId(userId: string): Promise<Collection[]> {
    return store.filter(c => c.userId === userId);
  }

  async getPublic(): Promise<Collection[]> {
    return store.filter(c => c.privacy === "public").sort((a, b) => b.likes - a.likes);
  }

  async save(collection: Collection): Promise<void> {
    const idx = store.findIndex(c => c.id === collection.id);
    if (idx >= 0) {
      store[idx] = collection;
    } else {
      store.push(collection);
    }
  }

  async update(id: string, data: Partial<Collection>): Promise<void> {
    const idx = store.findIndex(c => c.id === id);
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
    }
  }

  async delete(id: string): Promise<void> {
    store = store.filter(c => c.id !== id);
  }
}
