import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreOutfitRepository } from "@/infrastructure/firebase/FirestoreOutfitRepository";
import { FirestoreFollowRepository } from "@/infrastructure/firebase/FirestoreFollowRepository";
import { GetFeed } from "@/application/use-cases/GetFeed";

const outfitRepo = new FirestoreOutfitRepository();
const followRepo = new FirestoreFollowRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, type } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const useCase = new GetFeed(outfitRepo, followRepo);
      const feed = await useCase.execute(userId, (type as "following" | "discover") ?? "discover");
      if (feed.length === 0) {
        throw new Error("Empty feed, trigger seed fallback");
      }
      return res.status(200).json(feed);
    } catch (dbError) {
      console.warn("Firestore feed failed or empty, falling back to seed data:", dbError);
      const { seedOutfits } = await import("@/infrastructure/firebase/seedSocialData");
      const feedItems = seedOutfits.filter(o => o.privacy === "public").map(o => ({
        id: o.id,
        name: o.name,
        description: o.description ?? "",
        image: o.items[0]?.image ?? "",
        metadata: {
          userId: o.userId,
          userDisplayName: o.userDisplayName,
          userPhotoURL: undefined,
          likes: o.likes,
          items: o.items.map(item => ({ itemId: item.itemId, name: item.name, image: item.image })),
          createdAt: o.createdAt ?? new Date().toISOString()
        }
      }));
      return res.status(200).json(feedItems);
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
