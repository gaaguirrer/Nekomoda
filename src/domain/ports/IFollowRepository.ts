import { Follow } from "../entities/Follow";

export interface IFollowRepository {
  getById(id: string): Promise<Follow | null>;
  getFollowByPair(followerId: string, followingId: string): Promise<Follow | null>;
  getFollowers(userId: string): Promise<Follow[]>;
  getFollowing(userId: string): Promise<Follow[]>;
  getFollowingIds(userId: string): Promise<string[]>;
  save(follow: Follow): Promise<void>;
  delete(id: string): Promise<void>;
}
