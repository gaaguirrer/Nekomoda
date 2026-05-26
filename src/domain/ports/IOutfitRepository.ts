import { Outfit } from "../entities/Outfit";

export interface IOutfitRepository {
  getAll(): Promise<Outfit[]>;
  getById(id: string): Promise<Outfit | null>;
  getByUserId(userId: string): Promise<Outfit[]>;
  getPublic(): Promise<Outfit[]>;
  getFeed(userId: string, followingIds: string[]): Promise<Outfit[]>;
  save(outfit: Outfit): Promise<void>;
  update(id: string, data: Partial<Outfit>): Promise<void>;
  delete(id: string): Promise<void>;
  like(outfitId: string, userId: string): Promise<void>;
  unlike(outfitId: string, userId: string): Promise<void>;
}
