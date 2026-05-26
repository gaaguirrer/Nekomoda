import { ClothingItem } from "../entities/ClothingItem";

export interface IItemRepository {
  getAll(): Promise<ClothingItem[]>;
  getById(id: string): Promise<ClothingItem | null>;
}
