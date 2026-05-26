export type ClothingCategory =
  | "parte_superior"
  | "parte_inferior"
  | "vestidos"
  | "calzado"
  | "accesorios";

export interface ClothingItem {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: ClothingCategory;
  subcategory?: string;
  featureVector: number[];
  stock: number;
  active: boolean;
}
