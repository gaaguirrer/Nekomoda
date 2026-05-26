import { FashionEvent } from "../entities/Event";

export interface IEventRepository {
  getAll(): Promise<FashionEvent[]>;
  getById(id: string): Promise<FashionEvent | null>;
}
