import { IOutfitRepository } from "@/domain/ports/IOutfitRepository";
import { IUserRepository } from "@/domain/ports/IUserRepository";
import { Outfit, OutfitItem, PrivacyMode } from "@/domain/entities/Outfit";
import { TasteVector } from "@/domain/value-objects/TasteVector";

export interface CreateOutfitDTO {
  userId: string;
  name: string;
  description?: string;
  items: OutfitItem[];
  privacy: PrivacyMode;
  collectionId?: string;
}

export class CreateOutfit {
  constructor(
    private outfitRepo: IOutfitRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(dto: CreateOutfitDTO): Promise<Outfit> {
    const user = await this.userRepo.getById(dto.userId);
    const dims = TasteVector.dimensions();
    const vector = user?.tasteProfile?.vector ?? Array.from({ length: dims }, () => 0.5);

    const outfit: Outfit = {
      id: `outfit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: dto.userId,
      userDisplayName: user?.displayName,
      userPhotoURL: user?.photoURL,
      name: dto.name,
      description: dto.description,
      items: dto.items,
      featureVector: vector,
      privacy: dto.privacy,
      likes: 0,
      likedBy: [],
      commentCount: 0,
      collectionId: dto.collectionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.outfitRepo.save(outfit);
    await this.userRepo.update(dto.userId, { outfitCount: (user?.outfitCount ?? 0) + 1 });

    return outfit;
  }
}
