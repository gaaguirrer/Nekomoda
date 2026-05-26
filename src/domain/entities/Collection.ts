import { PrivacyMode } from "./Outfit";

export interface Collection {
  id: string;
  userId: string;
  userDisplayName?: string;
  name: string;
  description?: string;
  coverImage?: string;
  outfitIds: string[];
  privacy: PrivacyMode;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
