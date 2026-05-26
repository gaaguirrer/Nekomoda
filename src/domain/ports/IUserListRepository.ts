import { UserList } from "../entities/UserList";

export interface IUserListRepository {
  getByUserId(userId: string): Promise<UserList[]>;
  getById(id: string): Promise<UserList | null>;
  save(list: UserList): Promise<void>;
  update(id: string, data: Partial<UserList>): Promise<void>;
  delete(id: string): Promise<void>;
  addItem(listId: string, itemId: string): Promise<void>;
  removeItem(listId: string, itemId: string): Promise<void>;
}
