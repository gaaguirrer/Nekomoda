import type { NextApiRequest, NextApiResponse } from "next";
import { OnboardingUser } from "@/application/use-cases/OnboardingUser";
import { InMemoryUserRepository } from "@/infrastructure/firebase/InMemoryUserRepository";

const userRepo = new InMemoryUserRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
