export type ListType = "wishlist" | "favorites" | "custom";

export interface UserList {
  id: string;
  userId: string;
  name: string;
  type: ListType;
  itemIds: string[];
  createdAt: string;
  updatedAt: string;
}
