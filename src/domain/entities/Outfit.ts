export type PrivacyMode = "public" | "followers" | "private";

export interface OutfitItem {
  itemId: string;
  name: string;
  image: string;
  category: string;
}

export interface Outfit {
  id: string;
  userId: string;
  userDisplayName?: string;
  userPhotoURL?: string;
  name: string;
  description?: string;
  items: OutfitItem[];
  featureVector: number[];
  privacy: PrivacyMode;
  likes: number;
  likedBy: string[];
  commentCount: number;
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}
