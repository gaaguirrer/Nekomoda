import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest } from "@/infrastructure/demo/demoMiddleware";
import { DEMO_USER } from "@/infrastructure/demo/demoMode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (isDemoRequest(req)) {
    return res.status(200).json({ user: DEMO_USER });
  }

  try {
    const { uid, email, displayName, photoURL } = req.body;
    if (!uid || !email) return res.status(400).json({ error: "uid and email are required" });

    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const userRepo = new FirestoreUserRepository();
    const existing = await userRepo.getById(uid);

    if (!existing) {
      await userRepo.save({
        id: uid, email,
        displayName: displayName ?? email.split("@")[0],
        photoURL: photoURL ?? undefined,
        followerCount: 0, followingCount: 0, outfitCount: 0,
        createdAt: new Date().toISOString(), lastActivity: new Date().toISOString(),
      });
    }

    return res.status(200).json({ user: { uid, email, displayName, photoURL, isNew: !existing } });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
