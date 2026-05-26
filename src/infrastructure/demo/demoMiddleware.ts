import type { NextApiRequest } from "next";
import { InMemoryUserRepository } from "@/infrastructure/firebase/InMemoryUserRepository";
import { InMemoryItemRepository } from "@/infrastructure/firebase/InMemoryItemRepository";
import { InMemoryEventRepository } from "@/infrastructure/firebase/InMemoryEventRepository";
import { InMemoryPromotionRepository } from "@/infrastructure/firebase/InMemoryPromotionRepository";
import { InMemoryOutfitRepository } from "@/infrastructure/firebase/InMemoryOutfitRepository";
import { InMemoryCollectionRepository } from "@/infrastructure/firebase/InMemoryCollectionRepository";
import { InMemoryFollowRepository } from "@/infrastructure/firebase/InMemoryFollowRepository";
import { seedUsers } from "@/infrastructure/firebase/seedSocialData";
import { DEMO_USER_ID } from "./demoMode";

export function isDemoRequest(req: NextApiRequest): boolean {
  return req.headers["x-demo-mode"] === "true" || req.query.demo === "true";
}

export function getDemoUserId(req: NextApiRequest): string {
  return req.headers["x-demo-user-id"] as string || (req.query.userId as string) || DEMO_USER_ID;
}

export function getDemoRepos(req: NextApiRequest) {
  const userRepo = new InMemoryUserRepository();
  const itemRepo = new InMemoryItemRepository();
  const eventRepo = new InMemoryEventRepository();
  const promoRepo = new InMemoryPromotionRepository();
  const outfitRepo = new InMemoryOutfitRepository();
  const collectionRepo = new InMemoryCollectionRepository();
  const followRepo = new InMemoryFollowRepository();

  return { userRepo, itemRepo, eventRepo, promoRepo, outfitRepo, collectionRepo, followRepo };
}

export async function ensureDemoUser(req: NextApiRequest): Promise<void> {
  const { userRepo } = getDemoRepos(req);
  const existing = await userRepo.getById(DEMO_USER_ID);
  if (!existing) {
    const demoUser = {
      id: DEMO_USER_ID,
      email: "demo@nekomoda.app",
      displayName: "Demo Nekoda",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      bio: "Explorando NEKOMODA en modo demo",
      tasteProfile: { vector: [0.5, 0.5, 0.5, 0.5, 0.5], answers: { q1: "c", q2: "c", q3: "c", q4: "c", q5: "c" } },
      followerCount: 0, followingCount: 0, outfitCount: 0,
    };
    await userRepo.save(demoUser as any);
  }
}
