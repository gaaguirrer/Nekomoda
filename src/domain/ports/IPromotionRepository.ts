import { Promotion } from "../entities/Promotion";

export interface IPromotionRepository {
  getAll(): Promise<Promotion[]>;
  getById(id: string): Promise<Promotion | null>;
}
