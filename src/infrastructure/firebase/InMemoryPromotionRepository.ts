import { IPromotionRepository } from "@/domain/ports/IPromotionRepository";
import { Promotion } from "@/domain/entities/Promotion";
import { seedPromotions } from "./seedData";

export class InMemoryPromotionRepository implements IPromotionRepository {
  async getAll(): Promise<Promotion[]> {
    return seedPromotions;
  }

  async getById(id: string): Promise<Promotion | null> {
    return seedPromotions.find(p => p.id === id) ?? null;
  }
}
