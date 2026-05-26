import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreOutfitRepository } from "@/infrastructure/firebase/FirestoreOutfitRepository";

const outfitRepo = new FirestoreOutfitRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { outfitId, userId, action } = req.body;
    if (!outfitId || !userId || !action) {
      return res.status(400).json({ error: "outfitId, userId, and action (like|unlike) are required" });
    }

    if (action === "like") {
      await outfitRepo.like(outfitId, userId);
    } else {
      await outfitRepo.unlike(outfitId, userId);
    }

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
