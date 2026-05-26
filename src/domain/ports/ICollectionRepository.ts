import { Collection } from "../entities/Collection";

export interface ICollectionRepository {
  getAll(): Promise<Collection[]>;
  getById(id: string): Promise<Collection | null>;
  getByUserId(userId: string): Promise<Collection[]>;
  getPublic(): Promise<Collection[]>;
  save(collection: Collection): Promise<void>;
  update(id: string, data: Partial<Collection>): Promise<void>;
  delete(id: string): Promise<void>;
}
