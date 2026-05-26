import { NearestNeighborsService, Vectorized } from "@/application/services/NearestNeighborsService";

export interface UserProfile extends Vectorized {
  id: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  outfitCount: number;
}

export interface CompatibleUser {
  userId: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  matchScore: number;
  outfitCount: number;
  reason: string;
}

export class UserAffinityService {
  static findCompatibleUsers(
    userVector: number[],
    allUsers: UserProfile[],
    excludeUserId: string,
    k: number = 10
  ): CompatibleUser[] {
    const filtered = allUsers.filter(u => u.id !== excludeUserId && u.featureVector.length > 0);
    const nearest = NearestNeighborsService.getNearest(userVector, filtered, k);

    return nearest.map(u => ({
      userId: u.id,
      displayName: u.displayName,
      photoURL: u.photoURL,
      bio: u.bio,
      matchScore: u.matchScore,
      outfitCount: u.outfitCount,
      reason: u.matchScore >= 80
        ? "Estilo muy similar al tuyo"
        : u.matchScore >= 60
        ? "Estilo compatible"
        : "Estilo complementario",
    }));
  }

  static getOutfitCompatibility(
    userVector: number[],
    outfitVector: number[]
  ): number {
    const dist = NearestNeighborsService.euclideanDistance(userVector, outfitVector);
    const maxDist = Math.sqrt(userVector.length);
    return Math.round((1 - dist / maxDist) * 100);
  }
}
