import type { NextApiRequest, NextApiResponse } from "next";
import { InMemoryUserRepository } from "@/infrastructure/firebase/InMemoryUserRepository";
import { InMemoryItemRepository } from "@/infrastructure/firebase/InMemoryItemRepository";
import { InMemoryEventRepository } from "@/infrastructure/firebase/InMemoryEventRepository";
import { InMemoryPromotionRepository } from "@/infrastructure/firebase/InMemoryPromotionRepository";
import { RecommendItems } from "@/application/use-cases/RecommendItems";
import { RecommendEvents } from "@/application/use-cases/RecommendEvents";
import { RecommendPromotions } from "@/application/use-cases/RecommendPromotions";

const userRepo = new InMemoryUserRepository();
const itemRepo = new InMemoryItemRepository();
const eventRepo = new InMemoryEventRepository();
const promoRepo = new InMemoryPromotionRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, type } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    const user = await userRepo.getById(userId);
    if (!user?.tasteProfile) {
      return res.status(404).json({ error: "User profile not found. Complete onboarding first." });
    }

    const vector = user.tasteProfile.vector;
    const k = 10;

    let recommendations;

    switch (type) {
      case "events":
        recommendations = await new RecommendEvents(eventRepo).execute(vector, k);
        break;
      case "promotions":
        recommendations = await new RecommendPromotions(promoRepo).execute(vector, k);
        break;
      case "items":
      default:
        recommendations = await new RecommendItems(itemRepo).execute(vector, k);
        break;
    }

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Recommendations error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
