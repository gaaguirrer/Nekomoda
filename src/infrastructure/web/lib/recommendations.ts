import { RecommendationDTO } from "@/application/dto/RecommendationDTO";

export async function submitAnswers(answers: string[], userId: string): Promise<void> {
  const res = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, answers }),
  });
  if (!res.ok) throw new Error("Failed to submit answers");
}

export async function fetchRecommendations(
  userId: string,
  type: "items" | "events" | "promotions"
): Promise<RecommendationDTO[]> {
  const res = await fetch(`/api/recommendations?userId=${userId}&type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}
