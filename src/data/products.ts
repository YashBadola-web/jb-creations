import { Product, formatPriceINR, parsePriceToINR } from '@/types';

const createProduct = (
  id: string,
  name: string,
  description: string,
  priceRupees: number,
  category: Product['category'],
  images: string[],
  stock: number,
  featured: boolean = false
): Product => ({
  id,
  name,
  description,
  priceInPaise: parsePriceToINR(priceRupees),
  displayPrice: formatPriceINR(parsePriceToINR(priceRupees)),
  category,
  images,
  stock,
  featured,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const initialProducts: Product[] = [
  createProduct(
    'prod_001',
    'Ocean Wave Resin Coaster Set',
    'Handcrafted resin coasters inspired by ocean waves. Each set includes 4 unique pieces with swirling blues and whites that capture the essence of the sea.',
    1499,
    'resin',
    ['https://images.unsplash.com/photo-1620783770629-122b7f187703?w=600'],
    25,
    true
  ),
  createProduct(
    'prod_002',
    'Sunset Marble Resin Tray',
    'A stunning decorative tray featuring warm sunset hues blended in mesmerizing marble patterns. Perfect for jewelry or as a centerpiece.',
    2299,
    'resin',
    ['https://images.unsplash.com/photo-1616627988170-6c5c0f586d14?w=600'],
    15,
    true
  ),
  createProduct(
    'prod_003',
    'Wooden Stacking Blocks',
    'Natural wooden stacking blocks for creative play. Sanded smooth and finished with child-safe oils. Set of 20 pieces in various shapes.',
    899,
    'kids',
    ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'],
    40,
    true
  ),
  createProduct(
    'prod_004',
    'Floral Pressed Resin Bookmark',
    'Delicate dried flowers preserved in crystal-clear resin. Each bookmark is a unique piece of art that brings nature to your reading.',
    399,
    'resin',
    ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'],
    50,
    false
  ),
  createProduct(
    'prod_005',
    'Handcarved Wooden Animals Set',
    'Charming hand-carved wooden animal figurines. Each piece is individually crafted from sustainable wood. Set includes 6 forest animals.',
    1299,
    'kids',
    ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    20,
    true
  ),
  createProduct(
    'prod_006',
    'Geode Inspired Wall Art',
    'Large statement piece featuring layered resin in geode patterns. Rich purples, blues, and gold leaf create a stunning focal point.',
    4999,
    'decor',
    ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'],
    8,
    true
  ),
  createProduct(
    'prod_007',
    'Rainbow Pull-Along Toy',
    'Classic wooden pull-along toy with colorful rainbow arches. Helps develop motor skills while providing endless entertainment.',
    749,
    'kids',
    ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600'],
    35,
    false
  ),
  createProduct(
    'prod_008',
    'Terrazzo Resin Trinket Dish',
    'Modern terrazzo-style resin dish perfect for rings, earrings, or small treasures. Neutral tones complement any decor.',
    599,
    'decor',
    ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600'],
    30,
    false
  ),
  createProduct(
    'prod_009',
    'Monstera Leaf Coasters',
    'Botanical resin coasters shaped like monstera leaves. Set of 4 in gradient greens that bring tropical vibes to your table.',
    1199,
    'resin',
    ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600'],
    22,
    false
  ),
  createProduct(
    'prod_010',
    'Macramé Wall Hanging',
    'Handwoven macramé wall hanging in natural cotton. Intricate knotwork creates a bohemian accent for any room.',
    1899,
    'decor',
    ['https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600'],
    12,
    true
  ),
  createProduct(
    'prod_011',
    'Wooden Train Set',
    'Classic wooden train set with tracks, engine, and carriages. Compatible with major brands. Encourages imaginative play.',
    2499,
    'kids',
    ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'],
    18,
    false
  ),
  createProduct(
    'prod_012',
    'Galaxy Resin Clock',
    'Mesmerizing clock featuring deep space colors and metallic swirls. A functional piece of art for any wall.',
    3499,
    'decor',
    ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600'],
    10,
    false
  ),
];
