import { IEventRepository } from "@/domain/ports/IEventRepository";
import { NearestNeighborsService } from "../services/NearestNeighborsService";
import { RecommendationDTO } from "../dto/RecommendationDTO";

export class RecommendEvents {
  constructor(private eventRepo: IEventRepository) {}

  async execute(userVector: number[], k: number = 10): Promise<RecommendationDTO[]> {
    const allEvents = await this.eventRepo.getAll();

    const nearest = NearestNeighborsService.getNearest(userVector, allEvents, k);

    return nearest.map(event => ({
      id: event.id,
      name: event.title,
      description: event.description ?? "",
      image: event.image,
      matchScore: event.matchScore,
      type: "event" as const,
      metadata: { date: event.date, location: event.location },
    }));
  }
}
