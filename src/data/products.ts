import { Product, formatPriceINR, parsePriceToINR } from '@/types';

const createProduct = (
  id: string,
  name: string,
  description: string,
  priceRupees: number,
  category: Product['category'],
  images: string[],
  stock: number,
  featured: boolean = false,
  sales: number = 0,
  subcategory?: string
): Product => ({
  id,
  name,
  description,
  priceInPaise: parsePriceToINR(priceRupees),
  costPriceInPaise: Math.round(parsePriceToINR(priceRupees) * 0.4), // Simulating 40% COGS
  displayPrice: formatPriceINR(parsePriceToINR(priceRupees)),
  category,
  subcategory,
  images,
  stock,
  featured,
  sales,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const initialProducts: Product[] = [
  createProduct(
    'prod_001',
    'Ocean Wave Resin Coaster Set',
    'Handcrafted resin coasters inspired by ocean waves. Each set includes 4 unique pieces with swirling blues and whites that capture the essence of the sea.',
    1499,
    'home_decor',
    ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'],
    25,
    true,
    150 // High Sales
  ),
  createProduct(
    'prod_002',
    'Sunset Marble Resin Tray',
    'A stunning decorative tray featuring warm sunset hues blended in mesmerizing marble patterns. Perfect for jewelry or as a centerpiece.',
    2299,
    'home_decor',
    ['https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?w=600'],
    15,
    true,
    85
  ),
  createProduct(
    'prod_003',
    'Wooden Stacking Blocks',
    'Natural wooden stacking blocks for creative play. Sanded smooth and finished with child-safe oils. Set of 20 pieces in various shapes.',
    899,
    'home_decor',
    ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'],
    40,
    true,
    120
  ),
  createProduct(
    'prod_004',
    'Floral Pressed Resin Bookmark',
    'Delicate dried flowers preserved in crystal-clear resin. Each bookmark is a unique piece of art that brings nature to your reading.',
    399,
    'home_decor',
    ['https://images.unsplash.com/photo-1601056639638-3162a874b765?w=600'],
    50,
    false,
    200 // Top Seller
  ),
  createProduct(
    'prod_005',
    'Handcarved Wooden Animals Set',
    'Charming hand-carved wooden animal figurines. Each piece is individually crafted from sustainable wood. Set includes 6 forest animals.',
    1299,
    'home_decor',
    ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    20,
    true,
    45
  ),
  createProduct(
    'prod_006',
    'Geode Inspired Wall Art',
    'Large statement piece featuring layered resin in geode patterns. Rich purples, blues, and gold leaf create a stunning focal point.',
    4999,
    'home_decor',
    ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'],
    8,
    true,
    10
  ),
  createProduct(
    'prod_007',
    'Rainbow Pull-Along Toy',
    'Classic wooden pull-along toy with colorful rainbow arches. Helps develop motor skills while providing endless entertainment.',
    749,
    'home_decor',
    ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600'],
    35,
    false,
    95
  ),
  createProduct(
    'prod_008',
    'Terrazzo Resin Trinket Dish',
    'Modern terrazzo-style resin dish perfect for rings, earrings, or small treasures. Neutral tones complement any decor.',
    599,
    'home_decor',
    ['https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600'],
    30,
    false,
    60
  ),
  createProduct(
    'prod_009',
    'Monstera Leaf Coasters',
    'Botanical resin coasters shaped like monstera leaves. Set of 4 in gradient greens that bring tropical vibes to your table.',
    1199,
    'home_decor',
    ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600'],
    22,
    false,
    110
  ),
  createProduct(
    'prod_010',
    'Macramé Wall Hanging',
    'Handwoven macramé wall hanging in natural cotton. Intricate knotwork creates a bohemian accent for any room.',
    1899,
    'home_decor',
    ['https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=600'],
    12,
    true,
    30
  ),
  createProduct(
    'prod_011',
    'Wooden Train Set',
    'Classic wooden train set with tracks, engine, and carriages. Compatible with major brands. Encourages imaginative play.',
    2499,
    'home_decor',
    ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'],
    18,
    false,
    75
  ),
  createProduct(
    'prod_012',
    'Galaxy Resin Clock',
    'Mesmerizing clock featuring deep space colors and metallic swirls. A functional piece of art for any wall.',
    3499,
    'home_decor',
    ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600'],
    10,
    false,
    25
  ),
  // CANDLE MAKING
  createProduct(
    'candle_wax_soy_1kg',
    'Premium Soy Wax 1kg',
    '100% natural soy wax flakes for container candles. Clean burning and easy to measure.',
    450,
    'candle_making',
    ['https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600'],
    100,
    false,
    300,
    'candle_wax'
  ),
  createProduct(
    'candle_fragrance_lavender',
    'Lavender Essential Oil 50ml',
    'High quality lavender fragrance oil for candle making. Calming and floral scent.',
    350,
    'candle_making',
    ['https://images.unsplash.com/photo-1596131499577-be8e59fa2c4f?w=600'],
    50,
    false,
    150,
    'candle_fragrance'
  ),
  createProduct(
    'candle_mould_bubble',
    'Silicon Bubble Candle Mould',
    'Trendy bubble cube candle mould. Durable silicon material for easy demoulding.',
    299,
    'candle_making',
    ['https://images.unsplash.com/photo-1628151016024-bb9a1a91e9bc?w=600'],
    30,
    true,
    220,
    'candle_equipment'
  ),
  createProduct(
    'candle_wick_cotton',
    'Pre-waxed Cotton Wicks (Pack of 50)',
    '15cm pre-waxed cotton wicks with metal sustainers. Suitable for soy and paraffin wax.',
    199,
    'candle_making',
    ['https://plus.unsplash.com/premium_photo-1675844883501-860829875880?w=600'],
    200,
    false,
    500,
    'candle_wicks'
  ),

  // RESIN MATERIALS - More Subcategories
  createProduct(
    'resin_epoxy_art_kit',
    'Art Resin Epoxy Kit (2:1) - 300g',
    'Crystal clear coating epoxy resin. Low bubbles, high gloss finish. Pack of Resin and Hardener.',
    650,
    'resin_materials',
    ['https://images.unsplash.com/photo-1595079676339-1534801fafde?w=600'],
    80,
    true,
    410,
    'resin_essentials'
  ),
  createProduct(
    'resin_mould_alphabet',
    'Alphabet Keychain Mould',
    'Reverse alphabet silicon mould for making personalized keychains.',
    150,
    'resin_materials',
    ['https://images.unsplash.com/photo-1616428782352-87063aa0ebcc?w=600'],
    60,
    false,
    180,
    'resin_moulds'
  ),
  createProduct(
    'resin_pigment_set',
    'Mica Powder Set (12 Colors)',
    'Vibrant pearlescent mica powders for resin art. 10g per color.',
    499,
    'resin_materials',
    ['https://images.unsplash.com/photo-1579762593175-202260549695?w=600'],
    45,
    false,
    95,
    'resin_color'
  ),

  // CUSTOMISED ITEMS
  createProduct(
    'custom_neon_sign',
    'Custom Neon Name Sign',
    'Personalized LED neon sign for room decor. Choose your text and color.',
    2999,
    'customised_items',
    ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600'],
    10,
    true,
    45,
    'custom_quotes'
  ),
  createProduct(
    'custom_acrylic_cutout',
    'Custom Acrylic Name Cutout',
    'Gold mirror acrylic name cutout for cake toppers or wall decor.',
    599,
    'customised_items',
    ['https://images.unsplash.com/photo-1533158623733-15e982928646?w=600'],
    30,
    false,
    140,
    'custom_mdf'
  ),

  // PACKING MATERIAL
  createProduct(
    'pack_box_kraft',
    'Kraft Gift Boxes (Set of 10)',
    'Eco-friendly brown kraft boxes for packaging handmade soaps or jewelry.',
    250,
    'packing_material',
    ['https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?w=600'],
    100,
    false,
    80,
    'packing_other'
  ),
  createProduct(
    'pack_shredded_paper',
    'Crinkle Shredded Paper - Pink',
    '100g bag of crinkle cut shredded paper filler for gift boxes.',
    120,
    'packing_material',
    ['https://images.unsplash.com/photo-1517850239247-c0e81792695c?w=600'],
    80,
    false,
    65,
    'packing_candle'
  ),

  // OTHER MATERIALS
  createProduct(
    'other_stones_chips',
    'Crystal Chips Set (7 Chakra)',
    'Real mini gemstone chips for resin inclusions or candle topping.',
    399,
    'other_materials',
    ['https://images.unsplash.com/photo-1567690187548-f1711322b519?w=600'],
    40,
    false,
    115,
    'other_stones'
  ),

  // DIY KITS
  createProduct(
    'diy_kit_candle',
    'Beginner Candle Making Kit',
    'Everything you need to make your first 4 soy candles. Wax, wicks, jars, and fragrance included.',
    1299,
    'diy_kits',
    ['https://images.unsplash.com/photo-1602874801002-36871a25db40?w=600'],
    25,
    true,
    90
  ),
  createProduct(
    'diy_kit_lipbalm',
    'DIY Lip Balm Kit',
    'Make your own natural organic lip balms. Includes beeswax, shea butter, and tubes.',
    899,
    'diy_kits',
    ['https://images.unsplash.com/photo-1629213197177-ad5406c86942?w=600'],
    20,
    false,
    55
  ),

  // ADDITIONAL: STICKERS & PACKING
  createProduct(
    'sticker_pack_vintage',
    'Vintage Aesthetic Stickers (50pcs)',
    'Waterproof vintage style stickers for journaling, resin art, or laptops.',
    199,
    'customised_items',
    ['https://images.unsplash.com/photo-1615469046755-d49d97274070?w=600'],
    150,
    false,
    400,
    'custom_stickers'
  ),
  createProduct(
    'resin_sticker_gold_foil',
    'Gold Foil Insert Stickers',
    'Transparent stickers with metallic gold foil designs. Perfect for embedding in resin coasters.',
    149,
    'resin_materials',
    ['https://images.unsplash.com/photo-1586075010923-2dd45eeed8bd?w=600'],
    200,
    true,
    600,
    'resin_stickers'
  ),
  createProduct(
    'alcohol_ink_set',
    'Alcohol Ink Set (Vibrant)',
    'Fast-drying alcohol inks for resin petri dish effects. 3 vivid colors.',
    399,
    'resin_materials',
    ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'],
    40,
    false,
    130,
    'resin_color'
  ),
  createProduct(
    'packing_bubble_wrap',
    'Honeycomb Paper Wrap 10m',
    'Eco-friendly alternative to bubble wrap. Expands to protect fragile resin items during shipping.',
    499,
    'packing_material',
    ['https://images.unsplash.com/photo-1623122473466-4195748af495?w=600'],
    50,
    false,
    90,
    'packing_resin'
  ),
  createProduct(
    'packing_thank_you_cards',
    'Thank You Cards (Pack of 50)',
    'Elegant "Thank You for Your Order" cards to include in your shipments.',
    199,
    'packing_material',
    ['https://images.unsplash.com/photo-1563967817028-09cb9d36a858?w=600'],
    100,
    false,
    250,
    'packing_other'
  ),
];
