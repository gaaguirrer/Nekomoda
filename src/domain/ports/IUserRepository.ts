import { User } from "../entities/User";

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  update(id: string, data: Partial<User>): Promise<void>;
  delete(id: string): Promise<void>;
}
