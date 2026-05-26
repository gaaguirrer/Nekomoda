export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  tasteProfile?: {
    vector: number[];
    answers: Record<string, string>;
  };
  followerCount: number;
  followingCount: number;
  outfitCount: number;
  createdAt: string;
  lastActivity: string;
}
