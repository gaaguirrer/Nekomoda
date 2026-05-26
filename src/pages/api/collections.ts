import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { CreateCollection } from "@/application/use-cases/CreateCollection";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (isDemoRequest(req)) {
      await ensureDemoUser(req);
      const { collectionRepo, outfitRepo } = getDemoRepos(req);
      switch (req.method) {
        case "GET": {
          const { userId, id } = req.query;
          if (id) {
            const col = await collectionRepo.getById(id as string);
            if (!col) return res.status(404).json({ error: "Collection not found" });
            return res.status(200).json(col);
          }
          if (userId) {
            const cols = await collectionRepo.getByUserId(userId as string);
            return res.status(200).json(cols);
          }
          const cols = await collectionRepo.getPublic();
          return res.status(200).json(cols);
        }
        case "POST": {
          const { userRepo } = getDemoRepos(req);
          const col = await new CreateCollection(collectionRepo, userRepo).execute(req.body);
          return res.status(201).json(col);
        }
        default:
          return res.status(405).json({ error: "Method not allowed" });
      }
    }

    const { FirestoreCollectionRepository } = await import("@/infrastructure/firebase/FirestoreCollectionRepository");
    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const { AddOutfitToCollection, RemoveOutfitFromCollection } = await import("@/application/use-cases/CreateCollection");
    const { FirestoreOutfitRepository } = await import("@/infrastructure/firebase/FirestoreOutfitRepository");

    const collRepo = new FirestoreCollectionRepository();
    const userRepo = new FirestoreUserRepository();

    switch (req.method) {
      case "GET": {
        const { userId, id } = req.query;
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
        return res.status(200).json(cols);
      }
      case "POST": {
        const { userId, name, description, coverImage, privacy } = req.body;
        if (!userId || !name) return res.status(400).json({ error: "userId and name are required" });
        const useCase = new CreateCollection(collRepo, userRepo);
        const col = await useCase.execute({ userId, name, description, coverImage, privacy });
        return res.status(201).json(col);
      }
      case "PATCH": {
        const { id, outfitId, action } = req.body;
        if (!id || !outfitId || !action) return res.status(400).json({ error: "id, outfitId, and action (add|remove) are required" });
        const outfitRepo = new FirestoreOutfitRepository();
        if (action === "add") await new AddOutfitToCollection(collRepo, outfitRepo).execute(id, outfitId);
        else await new RemoveOutfitFromCollection(collRepo, outfitRepo).execute(id, outfitId);
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
