import { IEventRepository } from "@/domain/ports/IEventRepository";
import { FashionEvent } from "@/domain/entities/Event";
import { seedEvents } from "./seedData";

export class InMemoryEventRepository implements IEventRepository {
  async getAll(): Promise<FashionEvent[]> {
    return seedEvents;
  }

  async getById(id: string): Promise<FashionEvent | null> {
    return seedEvents.find(e => e.id === id) ?? null;
  }
}
