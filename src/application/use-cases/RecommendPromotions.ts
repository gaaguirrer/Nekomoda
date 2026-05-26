import { IPromotionRepository } from "@/domain/ports/IPromotionRepository";
import { NearestNeighborsService } from "../services/NearestNeighborsService";
import { RecommendationDTO } from "../dto/RecommendationDTO";

export class RecommendPromotions {
  constructor(private promoRepo: IPromotionRepository) {}

  async execute(userVector: number[], k: number = 10): Promise<RecommendationDTO[]> {
    const allPromos = await this.promoRepo.getAll();
    const promosWithVector = allPromos.map(p => ({
      id: p.id,
      featureVector: p.targetVector,
    }));

    const nearest = NearestNeighborsService.getNearest(
      userVector,
      promosWithVector,
      k
    );

    const promoMap = new Map(allPromos.map(p => [p.id, p]));

    return nearest.map(n => {
      const promo = promoMap.get(n.id)!;
      return {
        id: promo.id,
        name: promo.title,
        description: promo.description,
        matchScore: n.matchScore,
        type: "promotion" as const,
        metadata: {
          discount: promo.discount,
          code: promo.code,
          expiresAt: promo.expiresAt,
        },
      };
    });
  }
}
