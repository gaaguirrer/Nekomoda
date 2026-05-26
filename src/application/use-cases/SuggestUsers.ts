import { IUserRepository } from "@/domain/ports/IUserRepository";
import { IFollowRepository } from "@/domain/ports/IFollowRepository";
import { UserAffinityService, UserProfile } from "@/domain/services/UserAffinityService";

export interface SuggestedUserDTO {
  userId: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  matchScore: number;
  outfitCount: number;
  reason: string;
  isFollowing: boolean;
}

export class SuggestUsers {
  constructor(
    private userRepo: IUserRepository,
    private followRepo: IFollowRepository
  ) {}

  async execute(currentUserId: string, k: number = 10): Promise<SuggestedUserDTO[]> {
    const currentUser = await this.userRepo.getById(currentUserId);
    if (!currentUser?.tasteProfile?.vector) return [];

    const allUsers = await this.userRepo.getAll();
    const followingIds = await this.followRepo.getFollowingIds(currentUserId);

    const profiles: UserProfile[] = allUsers
      .filter(u => u.tasteProfile?.vector)
      .map(u => ({
        id: u.id,
        featureVector: u.tasteProfile!.vector,
        displayName: u.displayName,
        photoURL: u.photoURL,
        bio: u.bio,
        outfitCount: u.outfitCount,
      }));

    const compatible = UserAffinityService.findCompatibleUsers(
      currentUser.tasteProfile.vector,
      profiles,
      currentUserId,
      k
    );

    return compatible.map(c => ({
      userId: c.userId,
      displayName: c.displayName,
      photoURL: c.photoURL,
      bio: c.bio,
      matchScore: c.matchScore,
      outfitCount: c.outfitCount,
      reason: c.reason,
      isFollowing: followingIds.includes(c.userId),
    }));
  }
}
