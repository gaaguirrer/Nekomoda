import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreUserRepository } from "@/infrastructure/firebase/FirestoreUserRepository";
import { User } from "@/domain/entities/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { uid, email, displayName, photoURL } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }

    const userRepo = new FirestoreUserRepository();
    const existing = await userRepo.getById(uid);

    if (!existing) {
      const user: User = {
        id: uid,
        email,
        displayName: displayName ?? email.split("@")[0],
        photoURL: photoURL ?? undefined,
        followerCount: 0,
        followingCount: 0,
        outfitCount: 0,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      await userRepo.save(user);
    }

    return res.status(200).json({
      user: { uid, email, displayName, photoURL, isNew: !existing },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
