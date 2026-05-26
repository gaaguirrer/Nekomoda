import { IItemRepository } from "@/domain/ports/IItemRepository";
import { NearestNeighborsService } from "../services/NearestNeighborsService";
import { RecommendationDTO } from "../dto/RecommendationDTO";

export class RecommendItems {
  constructor(private itemRepo: IItemRepository) {}

  async execute(userVector: number[], k: number = 10): Promise<RecommendationDTO[]> {
    const allItems = await this.itemRepo.getAll();
    const activeItems = allItems.filter(i => i.active && i.stock > 0);

    const nearest = NearestNeighborsService.getNearest(userVector, activeItems, k);

    return nearest.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.images?.[0],
      price: item.price,
      matchScore: item.matchScore,
      type: "item" as const,
    }));
  }
}
