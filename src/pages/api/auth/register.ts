import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest } from "@/infrastructure/demo/demoMiddleware";
import { DEMO_USER } from "@/infrastructure/demo/demoMode";
import { InMemoryUserRepository } from "@/infrastructure/firebase/InMemoryUserRepository";
import { User } from "@/domain/entities/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (isDemoRequest(req)) {
    const { displayName } = req.body;
    const userRepo = new InMemoryUserRepository();
    const newUser: User = {
      id: `demo_${Date.now()}`,
      email: `${displayName?.toLowerCase().replace(/\s/g, "_") || "demo"}@nekomoda.app`,
      displayName: displayName || "Demo User",
      followerCount: 0, followingCount: 0, outfitCount: 0,
      createdAt: new Date().toISOString(), lastActivity: new Date().toISOString(),
    };
    await userRepo.save(newUser);
    return res.status(201).json({ user: { uid: newUser.id, email: newUser.email, displayName: newUser.displayName, isNew: true } });
  }

  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "email, password, and displayName are required" });
    }

    const { FirebaseAuthService } = await import("@/infrastructure/firebase/FirebaseAuthService");
    const { FirestoreUserRepository } = await import("@/infrastructure/firebase/FirestoreUserRepository");
    const authService = new FirebaseAuthService();
    const authUser = await authService.register(email, password, displayName);

    const userRepo = new FirestoreUserRepository();
    const user: User = {
      id: authUser.uid, email: authUser.email ?? email, displayName,
      photoURL: authUser.photoURL ?? undefined,
      followerCount: 0, followingCount: 0, outfitCount: 0,
      createdAt: new Date().toISOString(), lastActivity: new Date().toISOString(),
    };
    await userRepo.save(user);

    return res.status(201).json({ user: { uid: authUser.uid, email, displayName } });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "auth/email-already-in-use") return res.status(409).json({ error: "Email already registered" });
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
