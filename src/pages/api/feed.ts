import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { GetFeed } from "@/application/use-cases/GetFeed";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, type } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    if (isDemoRequest(req)) {
      await ensureDemoUser(req);
      const { outfitRepo, followRepo } = getDemoRepos(req);
      const useCase = new GetFeed(outfitRepo, followRepo);
      const feed = await useCase.execute(userId, (type as "following" | "discover") ?? "discover");
      return res.status(200).json(feed);
    }

    try {
      const { FirestoreOutfitRepository } = await import("@/infrastructure/firebase/FirestoreOutfitRepository");
      const { FirestoreFollowRepository } = await import("@/infrastructure/firebase/FirestoreFollowRepository");
      const outfitRepo = new FirestoreOutfitRepository();
      const followRepo = new FirestoreFollowRepository();
      const useCase = new GetFeed(outfitRepo, followRepo);
      const feed = await useCase.execute(userId, (type as "following" | "discover") ?? "discover");
      if (feed.length === 0) throw new Error("Empty feed");
      return res.status(200).json(feed);
    } catch {
      const { seedOutfits } = await import("@/infrastructure/firebase/seedSocialData");
      const fallback = seedOutfits.filter(o => o.privacy === "public").map(o => ({
        id: o.id, name: o.name, description: o.description ?? "",
        image: o.items[0]?.image ?? "",
        metadata: { userId: o.userId, userDisplayName: o.userDisplayName, likes: o.likes, items: o.items, createdAt: o.createdAt },
      }));
      return res.status(200).json(fallback);
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
