import { IOutfitRepository } from "@/domain/ports/IOutfitRepository";
import { IFollowRepository } from "@/domain/ports/IFollowRepository";
import { Outfit } from "@/domain/entities/Outfit";
import { RecommendationDTO } from "../dto/RecommendationDTO";

export class GetFeed {
  constructor(
    private outfitRepo: IOutfitRepository,
    private followRepo: IFollowRepository
  ) {}

  async execute(userId: string, type: "following" | "discover" = "discover"): Promise<RecommendationDTO[]> {
    if (type === "following") {
      const followingIds = await this.followRepo.getFollowingIds(userId);
      if (followingIds.length === 0) return [];
      const outfits = await this.outfitRepo.getFeed(userId, followingIds);
      return outfits.map(o => this.toDTO(o));
    }

    const outfits = await this.outfitRepo.getPublic();
    return outfits.map(o => this.toDTO(o));
  }

  private toDTO(outfit: Outfit): RecommendationDTO {
    return {
      id: outfit.id,
      name: outfit.name,
      description: outfit.description ?? "",
      image: outfit.items[0]?.image,
      matchScore: 0,
      type: "item",
      metadata: {
        userId: outfit.userId,
        userDisplayName: outfit.userDisplayName,
        userPhotoURL: outfit.userPhotoURL,
        likes: outfit.likes,
        items: outfit.items,
        privacy: outfit.privacy,
        createdAt: outfit.createdAt,
      },
    };
  }
}
