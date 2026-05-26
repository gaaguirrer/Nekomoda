import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";
import { UserAffinityService } from "@/domain/services/UserAffinityService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    if (isDemoRequest(req)) {
      ensureDemoUser(req);
      const { userRepo, outfitRepo } = getDemoRepos(req);
      const user = await userRepo.getById(userId);
      if (!user?.tasteProfile?.vector) {
        return res.status(404).json({ error: "User profile not found. Complete onboarding first." });
      }
      const outfits = await outfitRepo.getPublic();
      const compatible = outfits
        .map(o => ({
          ...o,
          compatibilityScore: UserAffinityService.getOutfitCompatibility(
            user.tasteProfile!.vector,
            o.featureVector
          ),
        }))
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
        .slice(0, 20);
      return res.status(200).json(compatible);
    }

    const { FirestoreOutfitRepository } = await import("@/infrastructure/firebase/FirestoreOutfitRepository");
    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const outfitRepo = new FirestoreOutfitRepository();
    const userRepo = new FirestoreUserRepository();
    const user = await userRepo.getById(userId);
    if (!user?.tasteProfile?.vector) {
      return res.status(404).json({ error: "User profile not found. Complete onboarding first." });
    }
    const outfits = await outfitRepo.getPublic();
    const compatible = outfits
      .map(o => ({
        ...o,
        compatibilityScore: UserAffinityService.getOutfitCompatibility(
          user.tasteProfile!.vector,
          o.featureVector
        ),
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 20);
    return res.status(200).json(compatible);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
