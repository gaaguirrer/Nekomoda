import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { SuggestUsers } from "@/application/use-cases/SuggestUsers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });

    if (isDemoRequest(req)) {
      await ensureDemoUser(req);
      const { userRepo, followRepo } = getDemoRepos(req);
      const useCase = new SuggestUsers(userRepo, followRepo);
      const suggestions = await useCase.execute(userId);
      return res.status(200).json(suggestions);
    }

    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const { FirestoreFollowRepository } = await import("@/infrastructure/firebase/FirestoreFollowRepository");
    const userRepo = new FirestoreUserRepository();
    const followRepo = new FirestoreFollowRepository();
    const useCase = new SuggestUsers(userRepo, followRepo);
    const suggestions = await useCase.execute(userId);
    return res.status(200).json(suggestions);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
