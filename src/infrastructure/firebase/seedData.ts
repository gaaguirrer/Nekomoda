import { ClothingItem } from "@/domain/entities/ClothingItem";
import { FashionEvent } from "@/domain/entities/Event";
import { Promotion } from "@/domain/entities/Promotion";

export const seedItems: ClothingItem[] = [
  {
    id: "item-1",
    name: "Blazer Estructurado 'Linaje'",
    description: "Blazer negro con hombros arquitectónicos, confeccionado en lana premium.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    price: 285,
    category: "ropa",
    featureVector: [0.75, 0.0, 0.0, 0.75, 0.75],
    stock: 15,
    active: true,
  },
  {
    id: "item-2",
    name: "Vestido Seda 'Atardecer'",
    description: "Vestido de seda en tono terracota con drapeado artesanal.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    price: 420,
    category: "ropa",
    featureVector: [0.5, 1.0, 0.5, 1.0, 0.75],
    stock: 8,
    active: true,
  },
  {
    id: "item-3",
    name: "Botas Chelsea 'Métrica'",
    description: "Botas de cuero artesanal con suela de crepé.",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
    ],
    price: 310,
    category: "calzado",
    featureVector: [0.25, 0.0, 0.0, 0.25, 0.5],
    stock: 22,
    active: true,
  },
  {
    id: "item-4",
    name: "Abrigo Lana 'Nórdico'",
    description: "Abrigo de lana marfil de corte limpio y minimalista.",
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80",
    ],
    price: 550,
    category: "ropa",
    featureVector: [0.75, 0.0, 0.0, 0.5, 1.0],
    stock: 5,
    active: true,
  },
  {
    id: "item-5",
    name: "Camisa Algodón 'Lino'",
    description: "Camisa oversize de lino blanco, perfecta para looks casuales.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    ],
    price: 120,
    category: "ropa",
    featureVector: [0.0, 0.0, 0.0, 0.0, 0.25],
    stock: 30,
    active: true,
  },
  {
    id: "item-6",
    name: "Jeans Premium 'Raw'",
    description: "Jeans de mezclilla cruda japonesa, corte recto.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    ],
    price: 185,
    category: "ropa",
    featureVector: [0.25, 0.0, 0.0, 0.25, 0.5],
    stock: 20,
    active: true,
  },
  {
    id: "item-7",
    name: "Chaqueta Cuero 'Clásica'",
    description: "Chaqueta de cuero legítimo con forro de seda.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    price: 680,
    category: "ropa",
    featureVector: [0.5, 0.25, 0.25, 0.5, 1.0],
    stock: 7,
    active: true,
  },
  {
    id: "item-8",
    name: "Falda Plisada 'Geométrica'",
    description: "Falda plisada con patrón geométrico en tonos vibrantes.",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    ],
    price: 220,
    category: "ropa",
    featureVector: [0.5, 0.75, 1.0, 0.5, 0.5],
    stock: 12,
    active: true,
  },
];

export const seedEvents: FashionEvent[] = [
  {
    id: "event-1",
    title: "Presentación Colección Otoño/Invierno",
    description: "Semana de la Moda de Madrid. Descubre las tendencias de la próxima temporada.",
    date: "2026-10-24",
    location: "IFEMA Madrid",
    image: "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800&q=80",
    featureVector: [0.75, 0.5, 0.25, 1.0, 0.75],
  },
  {
    id: "event-2",
    title: "Venta Privada: Lujo Sostenible",
    description: "Acceso exclusivo a nuestra colección de lujo sostenible.",
    date: "2026-11-15",
    location: "Barcelona",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    featureVector: [0.5, 0.25, 0.25, 0.75, 0.75],
  },
  {
    id: "event-3",
    title: "Workshop: Editorial Styling",
    description: "Aprende técnicas de styling editorial con profesionales de la industria.",
    date: "2026-12-02",
    location: "Online",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80",
    featureVector: [0.25, 0.5, 0.5, 0.25, 0.25],
  },
];

export const seedPromotions: Promotion[] = [
  {
    id: "promo-1",
    title: "Acne Studios",
    description: "Acceso anticipado a la colección cápsula 'Sand & Ink'.",
    discount: 30,
    code: "MODA30",
    targetVector: [0.5, 0.25, 0.25, 0.5, 0.75],
  },
  {
    id: "promo-2",
    title: "Loewe",
    description: "Envío prioritario y regalo exclusivo en artículos de piel.",
    discount: 0,
    targetVector: [0.75, 0.25, 0.0, 0.75, 1.0],
  },
  {
    id: "promo-3",
    title: "Jacquemus",
    description: "Descuento del 15% en tu próxima compra de accesorios.",
    discount: 15,
    code: "JACQ15",
    targetVector: [0.25, 0.75, 0.75, 0.5, 0.5],
    expiresAt: "2026-12-31",
  },
];
