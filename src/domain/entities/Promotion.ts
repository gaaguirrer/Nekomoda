export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  code?: string;
  targetVector: number[];
  expiresAt?: string;
}
