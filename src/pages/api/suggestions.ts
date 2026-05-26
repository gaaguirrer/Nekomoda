import type { NextApiRequest, NextApiResponse } from "next";
import { FirestoreUserRepository } from "@/infrastructure/firebase/FirestoreUserRepository";
import { FirestoreFollowRepository } from "@/infrastructure/firebase/FirestoreFollowRepository";
import { SuggestUsers } from "@/application/use-cases/SuggestUsers";

const userRepo = new FirestoreUserRepository();
const followRepo = new FirestoreFollowRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    const useCase = new SuggestUsers(userRepo, followRepo);
    const suggestions = await useCase.execute(userId);

    return res.status(200).json(suggestions);
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
