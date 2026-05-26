export interface Vectorized {
  id: string;
  featureVector: number[];
}

export class NearestNeighborsService {
  static euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length");
    }
    const sum = a.reduce((acc, val, i) => acc + (val - b[i]) ** 2, 0);
    return Math.sqrt(sum);
  }

  static getNearest<T extends Vectorized>(
    userVector: number[],
    items: T[],
    k: number = 10
  ): (T & { distance: number; matchScore: number })[] {
    const maxDist = Math.sqrt(userVector.length);

    const withDistances = items
      .map(item => {
        const distance = this.euclideanDistance(userVector, item.featureVector);
        const matchScore = Math.round((1 - distance / maxDist) * 100);
        return { ...item, distance, matchScore };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);

    return withDistances;
  }
}
