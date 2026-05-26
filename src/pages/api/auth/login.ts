import type { NextApiRequest, NextApiResponse } from "next";
import { isDemoRequest } from "@/infrastructure/demo/demoMiddleware";
import { DEMO_USER } from "@/infrastructure/demo/demoMode";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (isDemoRequest(req)) {
    return res.status(200).json({ user: DEMO_USER });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const { FirebaseAuthService } = await import("@/infrastructure/firebase/FirebaseAuthService");
    const authService = new FirebaseAuthService();
    const authUser = await authService.login(email, password);

    return res.status(200).json({ user: authUser });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.status(500).json({ error: err.message ?? "Internal server error" });
  }
}
