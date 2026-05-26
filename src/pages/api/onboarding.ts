import type { NextApiRequest, NextApiResponse } from "next";
import { OnboardingUser } from "@/application/use-cases/OnboardingUser";
import { InMemoryUserRepository } from "@/infrastructure/firebase/InMemoryUserRepository";
import { isDemoRequest, getDemoRepos, ensureDemoUser } from "@/infrastructure/demo/demoMiddleware";

const userRepo = new InMemoryUserRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { userId } = req.query;
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "userId is required" });
      }

      let repo = userRepo;
      if (isDemoRequest(req)) {
        await ensureDemoUser(req);
        const repos = getDemoRepos(req);
        repo = repos.userRepo;
      }

      const user = await repo.getById(userId);
      if (!user?.tasteProfile) {
        return res.status(200).json({ answers: null });
      }

      const answersArray: string[] = [];
      for (let i = 1; i <= 5; i++) {
        const key = `q${i}` as keyof typeof user.tasteProfile.answers;
        answersArray.push(user.tasteProfile.answers[key] ?? "");
      }

      return res.status(200).json({ answers: answersArray, vector: user.tasteProfile.vector });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { userId, answers } = req.body;

    if (!userId || !answers || !Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({ error: "Invalid request body. Provide userId and answers array (length 5)." });
    }

    const validAnswers = ["a", "b", "c", "d", "e"];
    for (const a of answers) {
      if (!validAnswers.includes(a.toLowerCase())) {
        return res.status(400).json({ error: `Invalid answer "${a}". Must be a, b, c, d, or e.` });
      }
    }

    const useCase = new OnboardingUser(userRepo);
    await useCase.execute({ userId, answers });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
