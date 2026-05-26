import type { NextApiRequest, NextApiResponse } from "next";
import { getFirestoreDB } from "@/infrastructure/firebase/firebaseClient";
import { doc, setDoc } from "firebase/firestore";
import { seedItems } from "@/infrastructure/firebase/seedData";
import { seedEvents } from "@/infrastructure/firebase/seedData";
import { seedPromotions } from "@/infrastructure/firebase/seedData";
import { seedUsers, seedOutfits, seedCollections } from "@/infrastructure/firebase/seedSocialData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = getFirestoreDB();
    const results: Record<string, number> = {};

    for (const item of seedItems) {
      const { id: _i, ...data } = item;
      await setDoc(doc(db, "items", _i), { ...data });
    }
    results.items = seedItems.length;

    for (const event of seedEvents) {
      const { id: _i, ...data } = event;
      await setDoc(doc(db, "events", _i), { ...data });
    }
    results.events = seedEvents.length;

    for (const promo of seedPromotions) {
      const { id: _i, ...data } = promo;
      await setDoc(doc(db, "promotions", _i), { ...data });
    }
    results.promotions = seedPromotions.length;

    for (const user of seedUsers) {
      await setDoc(doc(db, "users", user.id), { ...user });
    }
    results.users = seedUsers.length;

    for (const outfit of seedOutfits) {
      const { id: _i, ...data } = outfit;
      await setDoc(doc(db, "outfits", _i), { ...data });
    }
    results.outfits = seedOutfits.length;

    for (const col of seedCollections) {
      const { id: _i, ...data } = col;
      await setDoc(doc(db, "collections", _i), { ...data });
    }
    results.collections = seedCollections.length;

    return res.status(200).json({ success: true, seeded: results });
  } catch (error: unknown) {
    return res.status(500).json({ error: (error as Error).message ?? "Internal server error" });
  }
}
