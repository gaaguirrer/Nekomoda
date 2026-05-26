export interface RecommendationDTO {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: number;
  matchScore: number;
  type: "item" | "event" | "promotion";
  metadata?: Record<string, unknown>;
}
