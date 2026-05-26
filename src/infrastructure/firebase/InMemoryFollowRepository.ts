import { IFollowRepository } from "@/domain/ports/IFollowRepository";
import { Follow } from "@/domain/entities/Follow";

let store: Follow[] = [
  { id: "follow_1", followerId: "user_alex", followingId: "user_camila", createdAt: new Date().toISOString() },
  { id: "follow_2", followerId: "user_alex", followingId: "user_diego", createdAt: new Date().toISOString() },
  { id: "follow_3", followerId: "user_camila", followingId: "user_alex", createdAt: new Date().toISOString() },
  { id: "follow_4", followerId: "user_diego", followingId: "user_alex", createdAt: new Date().toISOString() },
  { id: "follow_5", followerId: "user_diego", followingId: "user_camila", createdAt: new Date().toISOString() },
];

export function resetFollowStore() {
  store = [
    { id: "follow_1", followerId: "user_alex", followingId: "user_camila", createdAt: new Date().toISOString() },
    { id: "follow_2", followerId: "user_alex", followingId: "user_diego", createdAt: new Date().toISOString() },
    { id: "follow_3", followerId: "user_camila", followingId: "user_alex", createdAt: new Date().toISOString() },
    { id: "follow_4", followerId: "user_diego", followingId: "user_alex", createdAt: new Date().toISOString() },
    { id: "follow_5", followerId: "user_diego", followingId: "user_camila", createdAt: new Date().toISOString() },
  ];
}

export class InMemoryFollowRepository implements IFollowRepository {
  async getById(id: string): Promise<Follow | null> {
    return store.find(f => f.id === id) ?? null;
  }

  async getFollowByPair(followerId: string, followingId: string): Promise<Follow | null> {
    return store.find(f => f.followerId === followerId && f.followingId === followingId) ?? null;
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    return store.filter(f => f.followingId === userId);
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    return store.filter(f => f.followerId === userId);
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    return store.filter(f => f.followerId === userId).map(f => f.followingId);
  }

  async save(follow: Follow): Promise<void> {
    store.push(follow);
  }

  async delete(id: string): Promise<void> {
    store = store.filter(f => f.id !== id);
  }
}
