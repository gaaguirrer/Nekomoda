import { IItemRepository } from "@/domain/ports/IItemRepository";
import { ClothingItem } from "@/domain/entities/ClothingItem";
import { seedItems } from "./seedData";

export class InMemoryItemRepository implements IItemRepository {
  async getAll(): Promise<ClothingItem[]> {
    return seedItems;
  }

  async getById(id: string): Promise<ClothingItem | null> {
    return seedItems.find(i => i.id === id) ?? null;
  }
}
