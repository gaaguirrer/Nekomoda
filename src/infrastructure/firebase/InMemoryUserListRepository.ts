import { IUserListRepository } from "@/domain/ports/IUserListRepository";
import { UserList } from "@/domain/entities/UserList";

const store: UserList[] = [];

export class InMemoryUserListRepository implements IUserListRepository {
  async getByUserId(userId: string): Promise<UserList[]> {
    return store.filter(l => l.userId === userId);
  }

  async getById(id: string): Promise<UserList | null> {
    return store.find(l => l.id === id) ?? null;
  }

  async save(list: UserList): Promise<void> {
    const idx = store.findIndex(l => l.id === list.id);
    if (idx >= 0) {
      store[idx] = list;
    } else {
      store.push(list);
    }
  }

  async update(id: string, data: Partial<UserList>): Promise<void> {
    const idx = store.findIndex(l => l.id === id);
    if (idx >= 0) {
      store[idx] = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
    }
  }

  async delete(id: string): Promise<void> {
    const idx = store.findIndex(l => l.id === id);
    if (idx >= 0) store.splice(idx, 1);
  }

  async addItem(listId: string, itemId: string): Promise<void> {
    const list = store.find(l => l.id === listId);
    if (list && !list.itemIds.includes(itemId)) {
      list.itemIds.push(itemId);
      list.updatedAt = new Date().toISOString();
    }
  }

  async removeItem(listId: string, itemId: string): Promise<void> {
    const list = store.find(l => l.id === listId);
    if (list) {
      list.itemIds = list.itemIds.filter(id => id !== itemId);
      list.updatedAt = new Date().toISOString();
    }
  }
}
