import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { ToggleFavoriteItem, GetUserFavorites } from "@/application/use-cases/ManageUserList";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (isDemoRequest(req)) {
      ensureDemoUser(req);
      const { userRepo, itemRepo } = getDemoRepos(req);

      const { InMemoryUserListRepository } = await import("@/infrastructure/firebase/InMemoryUserListRepository");
      const listRepo = new InMemoryUserListRepository();

      switch (req.method) {
        case "GET": {
          const { userId } = req.query;
          if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
          const useCase = new GetUserFavorites(listRepo, itemRepo);
          const result = await useCase.execute(userId);
          return res.status(200).json(result);
        }
        case "POST": {
          const { userId, itemId } = req.body;
          if (!userId || !itemId) return res.status(400).json({ error: "userId and itemId are required" });
          const useCase = new ToggleFavoriteItem(listRepo, itemRepo);
          const result = await useCase.execute(userId, itemId);
          return res.status(200).json(result);
        }
        default:
          return res.status(405).json({ error: "Method not allowed" });
      }
    }

    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const { InMemoryItemRepository } = await import("@/infrastructure/firebase/InMemoryItemRepository");
    const { InMemoryUserListRepository } = await import("@/infrastructure/firebase/InMemoryUserListRepository");
    const { FirestoreUserListRepository } = await import("@/infrastructure/firebase/FirestoreUserListRepository");

    const userRepo = new FirestoreUserRepository();
    const itemRepo = new InMemoryItemRepository();

    switch (req.method) {
      case "GET": {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
        const listRepo = new FirestoreUserListRepository();
        const useCase = new GetUserFavorites(listRepo, itemRepo);
        const result = await useCase.execute(userId);
        return res.status(200).json(result);
      }
      case "POST": {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) return res.status(400).json({ error: "userId and itemId are required" });
        const listRepo = new FirestoreUserListRepository();
        const useCase = new ToggleFavoriteItem(listRepo, itemRepo);
        const result = await useCase.execute(userId, itemId);
        return res.status(200).json(result);
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
