export interface User {
  id: string;
  tasteProfile?: {
    vector: number[];
    answers: Record<string, string>;
  };
  createdAt?: string;
  lastActivity?: string;
}
