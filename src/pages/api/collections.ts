import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreCollectionRepository } from "@/infrastructure/firebase/FirestoreCollectionRepository";
import { CreateCollection } from "@/application/use-cases/CreateCollection";
import { FirestoreUserRepository } from "@/infrastructure/firebase/FirestoreUserRepository";

const collRepo = new FirestoreCollectionRepository();
const userRepo = new FirestoreUserRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET": {
        const { userId, id } = req.query;
        try {
          if (id) {
            const col = await collRepo.getById(id as string);
            if (!col) return res.status(404).json({ error: "Collection not found" });
            return res.status(200).json(col);
          }
          if (userId) {
            const cols = await collRepo.getByUserId(userId as string);
            return res.status(200).json(cols);
          }
          const cols = await collRepo.getPublic();
          if (cols.length === 0) {
            const { seedCollections } = await import("@/infrastructure/firebase/seedSocialData");
            return res.status(200).json(seedCollections);
          }
          return res.status(200).json(cols);
        } catch (dbError) {
          console.warn("Firestore collection GET failed, falling back to seed data:", dbError);
          const { seedCollections } = await import("@/infrastructure/firebase/seedSocialData");
          return res.status(200).json(seedCollections);
        }
      }

      case "POST": {
        const { userId, name, description, coverImage, privacy } = req.body;
        if (!userId || !name) {
          return res.status(400).json({ error: "userId and name are required" });
        }
        const useCase = new CreateCollection(collRepo, userRepo);
        const col = await useCase.execute({ userId, name, description, coverImage, privacy });
        return res.status(201).json(col);
      }

      case "PATCH": {
        const { id, outfitId, action } = req.body;
        if (!id || !outfitId || !action) {
          return res.status(400).json({ error: "id, outfitId, and action (add|remove) are required" });
        }
        const { AddOutfitToCollection, RemoveOutfitFromCollection } = await import("@/application/use-cases/CreateCollection");
        const { FirestoreOutfitRepository } = await import("@/infrastructure/firebase/FirestoreOutfitRepository");
        const outfitRepo = new FirestoreOutfitRepository();
        if (action === "add") {
          await new AddOutfitToCollection(collRepo, outfitRepo).execute(id, outfitId);
        } else {
          await new RemoveOutfitFromCollection(collRepo, outfitRepo).execute(id, outfitId);
        }
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
