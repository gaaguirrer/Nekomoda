export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  featureVector: number[];
  stock: number;
  active: boolean;
}
