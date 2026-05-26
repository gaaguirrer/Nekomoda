import { RecommendationDTO } from "@/application/dto/RecommendationDTO";
import { apiPost, apiGet } from "@/infrastructure/web/lib/apiClient";

export async function submitAnswers(answers: string[], userId: string): Promise<void> {
  const res = await apiPost("/api/onboarding", { userId, answers });
  if (!res.ok) throw new Error("Failed to submit answers");
}

export async function fetchRecommendations(
  userId: string,
  type: "items" | "events" | "promotions"
): Promise<RecommendationDTO[]> {
  const res = await apiGet("/api/recommendations", { userId, type });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
