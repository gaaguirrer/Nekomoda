import { IUserRepository } from "@/domain/ports/IUserRepository";
import { User } from "@/domain/entities/User";

const users = new Map<string, User>();

export class InMemoryUserRepository implements IUserRepository {
  async getById(id: string): Promise<User | null> {
    return users.get(id) ?? null;
  }

  async save(user: User): Promise<void> {
    users.set(user.id, user);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    const existing = users.get(id);
    if (existing) {
      users.set(id, { ...existing, ...data });
    }
  }
}
