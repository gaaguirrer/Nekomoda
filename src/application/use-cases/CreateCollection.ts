import { ICollectionRepository } from "@/domain/ports/ICollectionRepository";
import { IOutfitRepository } from "@/domain/ports/IOutfitRepository";
import { IUserRepository } from "@/domain/ports/IUserRepository";
import { Collection } from "@/domain/entities/Collection";
import { PrivacyMode } from "@/domain/entities/Outfit";

export interface CreateCollectionDTO {
  userId: string;
  name: string;
  description?: string;
  coverImage?: string;
  privacy: PrivacyMode;
}

export class CreateCollection {
  constructor(
    private collectionRepo: ICollectionRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(dto: CreateCollectionDTO): Promise<Collection> {
    const user = await this.userRepo.getById(dto.userId);

    const collection: Collection = {
      id: `collection_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: dto.userId,
      userDisplayName: user?.displayName,
      name: dto.name,
      description: dto.description,
      coverImage: dto.coverImage,
      outfitIds: [],
      privacy: dto.privacy,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.collectionRepo.save(collection);
    return collection;
  }
}

export class AddOutfitToCollection {
  constructor(
    private collectionRepo: ICollectionRepository,
    private outfitRepo: IOutfitRepository
  ) {}

  async execute(collectionId: string, outfitId: string): Promise<void> {
    const collection = await this.collectionRepo.getById(collectionId);
    if (!collection) throw new Error("Collection not found");
    if (collection.outfitIds.includes(outfitId)) return;

    collection.outfitIds.push(outfitId);
    await this.collectionRepo.update(collectionId, { outfitIds: collection.outfitIds });

    await this.outfitRepo.update(outfitId, { collectionId });
  }
}

export class RemoveOutfitFromCollection {
  constructor(
    private collectionRepo: ICollectionRepository,
    private outfitRepo: IOutfitRepository
  ) {}

  async execute(collectionId: string, outfitId: string): Promise<void> {
    const collection = await this.collectionRepo.getById(collectionId);
    if (!collection) throw new Error("Collection not found");

    collection.outfitIds = collection.outfitIds.filter(id => id !== outfitId);
    await this.collectionRepo.update(collectionId, { outfitIds: collection.outfitIds });

    await this.outfitRepo.update(outfitId, { collectionId: undefined });
  }
}
