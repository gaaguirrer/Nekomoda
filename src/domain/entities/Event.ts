export interface FashionEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: string;
  featureVector: number[];
}
