import { IFollowRepository } from "@/domain/ports/IFollowRepository";
import { IUserRepository } from "@/domain/ports/IUserRepository";
import { Follow } from "@/domain/entities/Follow";

export class FollowUser {
  constructor(
    private followRepo: IFollowRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) throw new Error("Cannot follow yourself");

    const existing = await this.followRepo.getFollowByPair(followerId, followingId);
    if (existing) return;

    const follow: Follow = {
      id: `follow_${Date.now()}`,
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    };

    await this.followRepo.save(follow);

    const follower = await this.userRepo.getById(followerId);
    const following = await this.userRepo.getById(followingId);

    await this.userRepo.update(followerId, {
      followingCount: (follower?.followingCount ?? 0) + 1,
    });
    await this.userRepo.update(followingId, {
      followerCount: (following?.followerCount ?? 0) + 1,
    });
  }
}

export class UnfollowUser {
  constructor(
    private followRepo: IFollowRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(followerId: string, followingId: string): Promise<void> {
    const existing = await this.followRepo.getFollowByPair(followerId, followingId);
    if (!existing) return;

    await this.followRepo.delete(existing.id);

    const follower = await this.userRepo.getById(followerId);
    const following = await this.userRepo.getById(followingId);

    await this.userRepo.update(followerId, {
      followingCount: Math.max(0, (follower?.followingCount ?? 1) - 1),
    });
    await this.userRepo.update(followingId, {
      followerCount: Math.max(0, (following?.followerCount ?? 1) - 1),
    });
  }
}
