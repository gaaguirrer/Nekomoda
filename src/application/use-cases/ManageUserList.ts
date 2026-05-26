import { IUserListRepository } from "@/domain/ports/IUserListRepository";
import { IItemRepository } from "@/domain/ports/IItemRepository";
import { UserList, ListType } from "@/domain/entities/UserList";
import { ClothingItem } from "@/domain/entities/ClothingItem";

export class ToggleFavoriteItem {
  constructor(
    private listRepo: IUserListRepository,
    private itemRepo: IItemRepository
  ) {}

  async execute(userId: string, itemId: string): Promise<{ favorited: boolean; list: UserList }> {
    const item = await this.itemRepo.getById(itemId);
    if (!item) throw new Error("Item not found");

    const lists = await this.listRepo.getByUserId(userId);
    let favList = lists.find(l => l.type === "favorites");

    if (!favList) {
      favList = {
        id: `favlist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        userId,
        name: "Favoritos",
        type: "favorites" as ListType,
        itemIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await this.listRepo.save(favList);
    }

    const alreadyFav = favList.itemIds.includes(itemId);

    if (alreadyFav) {
      await this.listRepo.removeItem(favList.id, itemId);
      return { favorited: false, list: { ...favList, itemIds: favList.itemIds.filter(id => id !== itemId) } };
    } else {
      await this.listRepo.addItem(favList.id, itemId);
      return { favorited: true, list: { ...favList, itemIds: [...favList.itemIds, itemId] } };
    }
  }
}

export class GetUserFavorites {
  constructor(
    private listRepo: IUserListRepository,
    private itemRepo: IItemRepository
  ) {}

  async execute(userId: string): Promise<{ list: UserList | null; items: ClothingItem[] }> {
    const lists = await this.listRepo.getByUserId(userId);
    const favList = lists.find(l => l.type === "favorites") ?? null;

    if (!favList) return { list: null, items: [] };

    const items = (await Promise.all(favList.itemIds.map(id => this.itemRepo.getById(id))))
      .filter((i): i is ClothingItem => i !== null);

    return { list: favList, items };
  }
}
