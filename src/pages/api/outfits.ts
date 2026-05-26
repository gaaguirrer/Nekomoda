import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreOutfitRepository } from "@/infrastructure/firebase/FirestoreOutfitRepository";
import { FirestoreUserRepository } from "@/infrastructure/firebase/FirestoreUserRepository";
import { CreateOutfit } from "@/application/use-cases/CreateOutfit";

const outfitRepo = new FirestoreOutfitRepository();
const userRepo = new FirestoreUserRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const { userId, id } = req.query;
        if (id) {
          const outfit = await outfitRepo.getById(id as string);
          if (!outfit) return res.status(404).json({ error: "Outfit not found" });
          return res.status(200).json(outfit);
        }
        if (userId) {
          const outfits = await outfitRepo.getByUserId(userId as string);
          return res.status(200).json(outfits);
        }
        const outfits = await outfitRepo.getPublic();
        return res.status(200).json(outfits);
      }

      case "POST": {
        const { userId, name, description, items, privacy, collectionId } = req.body;
        if (!userId || !name || !items) {
          return res.status(400).json({ error: "userId, name, and items are required" });
        }
        const useCase = new CreateOutfit(outfitRepo, userRepo);
        const outfit = await useCase.execute({ userId, name, description, items, privacy, collectionId });
        return res.status(201).json(outfit);
      }

      case "DELETE": {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "id is required" });
        await outfitRepo.delete(id as string);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
