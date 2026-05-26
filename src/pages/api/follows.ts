import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { FollowUser, UnfollowUser } from "@/application/use-cases/FollowUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (isDemoRequest(req)) {
      ensureDemoUser(req);
      const { followRepo, userRepo } = getDemoRepos(req);
      switch (req.method) {
        case "GET": {
          const { userId, type } = req.query;
          if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
          if (type === "followers") {
            const follows = await followRepo.getFollowers(userId);
            const users = await Promise.all(follows.map(f => userRepo.getById(f.followerId)));
            return res.status(200).json(users.filter(Boolean));
          }
          const follows = await followRepo.getFollowing(userId);
          const users = await Promise.all(follows.map(f => userRepo.getById(f.followingId)));
          return res.status(200).json(users.filter(Boolean));
        }
        case "POST": {
          const { followerId, followingId } = req.body;
          if (!followerId || !followingId) return res.status(400).json({ error: "followerId and followingId are required" });
          await new FollowUser(followRepo, userRepo).execute(followerId, followingId);
          return res.status(200).json({ success: true });
        }
        case "DELETE": {
          const { followerId, followingId } = req.body;
          if (!followerId || !followingId) return res.status(400).json({ error: "followerId and followingId are required" });
          await new UnfollowUser(followRepo, userRepo).execute(followerId, followingId);
          return res.status(200).json({ success: true });
        }
        default:
          return res.status(405).json({ error: "Method not allowed" });
      }
    }

    const { FirestoreFollowRepository } = await import("@/infrastructure/firebase/FirestoreFollowRepository");
    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const followRepo = new FirestoreFollowRepository();
    const userRepo = new FirestoreUserRepository();

    switch (req.method) {
      case "GET": {
        const { userId, type } = req.query;
        if (!userId || typeof userId !== "string") return res.status(400).json({ error: "userId is required" });
        if (type === "followers") {
          const follows = await followRepo.getFollowers(userId);
          const users = await Promise.all(follows.map(f => userRepo.getById(f.followerId)));
          return res.status(200).json(users.filter(Boolean));
        }
        const follows = await followRepo.getFollowing(userId);
        const users = await Promise.all(follows.map(f => userRepo.getById(f.followingId)));
        return res.status(200).json(users.filter(Boolean));
      }
      case "POST": {
        const { followerId, followingId } = req.body;
        if (!followerId || !followingId) return res.status(400).json({ error: "followerId and followingId are required" });
        await new FollowUser(followRepo, userRepo).execute(followerId, followingId);
        return res.status(200).json({ success: true });
      }
      case "DELETE": {
        const { followerId, followingId } = req.body;
        if (!followerId || !followingId) return res.status(400).json({ error: "followerId and followingId are required" });
        await new UnfollowUser(followRepo, userRepo).execute(followerId, followingId);
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
