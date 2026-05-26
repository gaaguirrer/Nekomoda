import type { NextApiRequest, NextApiResponse } from "next";
import { FirebaseAuthService } from "@/infrastructure/firebase/FirebaseAuthService";
import { FirestoreUserRepository } from "@/infrastructure/firebase/FirestoreUserRepository";
import { User } from "@/domain/entities/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "email, password, and displayName are required" });
    }

    const authService = new FirebaseAuthService();
    const authUser = await authService.register(email, password, displayName);

    const userRepo = new FirestoreUserRepository();
    const user: User = {
      id: authUser.uid,
      email: authUser.email ?? email,
      displayName,
      photoURL: authUser.photoURL ?? undefined,
      followerCount: 0,
      followingCount: 0,
      outfitCount: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    await userRepo.save(user);

    return res.status(201).json({ user: { uid: authUser.uid, email, displayName } });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "auth/email-already-in-use") {
      return res.status(409).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
