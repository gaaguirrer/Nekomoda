import type { NextApiRequest, NextApiResponse } from "next";
import { seedItems } from "@/infrastructure/firebase/seedData";
import { categoryLabels } from "@/infrastructure/firebase/seedData";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { category, limit } = req.query;
  let items = [...seedItems];

  if (category && typeof category === "string") {
    items = items.filter((i) => i.category === category);
  }

  if (limit && typeof limit === "string") {
    items = items.slice(0, parseInt(limit, 10));
  }

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({
    key,
    label,
    count: seedItems.filter((i) => i.category === key).length,
  }));

  return res.status(200).json({ items, categories });
}
