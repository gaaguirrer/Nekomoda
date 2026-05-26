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

    const useCase = new GetFeed(outfitRepo, followRepo);
    const feed = await useCase.execute(userId, (type as "following" | "discover") ?? "discover");

    return res.status(200).json(feed);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
