import type { Category, Product } from '@/types/product';
import type { Order, ShippingAddress } from '@/types/order';
import type { Review, BlogPost, User, Coupon } from '@/types/index';

// ─── Categories ─────────────────────────────────────────────────────────────

export const categories: Category[] = [
  { id: 1, name: 'Co-ord Sets', slug: 'co-ord-sets', parent_id: null, image: '/category-co-ord-sets.jpg', description: 'Matching two/three-piece sets designed with ease', product_count: 8 },
  { id: 2, name: 'Maxi Dresses', slug: 'maxi-dresses', parent_id: null, image: '/category-maxi-dresses.jpg', description: 'Flowing full-length dresses made with soul', product_count: 36 },
  { id: 3, name: 'Kurtis', slug: 'kurtis', parent_id: null, image: '/category-kurtis.jpg', description: 'Everyday and festive kurtis for effortless elegance', product_count: 48 },
  { id: 4, name: 'Gen-Z Wear', slug: 'gen-z-wear', parent_id: null, image: '/category-gen-z-wear.jpg', description: 'Trend-led, youthful, contemporary fusion pieces', product_count: 30 },
  { id: 5, name: 'Lehengas', slug: 'lehengas', parent_id: null, image: '/category-lehengas.jpg', description: 'Exquisite bridal and festive lehengas handcrafted with traditional motifs', product_count: 15 }
];

export const products: Product[] = [
  
  {
    id: 51,
    name: "Rhea Paisley Cape & Palazzo 3-Piece Co-ord Set",
    slug: "rhea-paisley-cape-palazzo-3-piece-coord-set",
    description: "A sophisticated 3-piece obsidian black fusion co-ord set. Comprises a fitted crop top, wide-leg fluid palazzo trousers, and an airy full-length jacket adorned with traditional paisley patterns and fine zari border trimming.",
    fabric: "Satin Crepe & Georgette",
    care_instructions: "Dry clean only.",
    category_id: 1,
    category: categories[0],
    base_price: 4200,
    mrp: 5400,
    sku: "MBK-CO-051",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 45,
    tags: ["3-piece","paisley","festive","black"],
    created_at: "2026-08-01T10:05:00.000Z",
    variants: [
      { id: 511, product_id: 51, size: "S", color: "Obsidian Black", color_hex: "#1A1A1A", sku: "MBK-CO-051-S", stock_qty: 10 },
      { id: 512, product_id: 51, size: "M", color: "Obsidian Black", color_hex: "#1A1A1A", sku: "MBK-CO-051-M", stock_qty: 16 },
      { id: 513, product_id: 51, size: "L", color: "Obsidian Black", color_hex: "#1A1A1A", sku: "MBK-CO-051-L", stock_qty: 8 }
    ],
    images: [
      { id: 511, product_id: 51, image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&q=90", sort_order: 0, alt_text: "Rhea Paisley Cape & Palazzo 3-Piece Co-ord Set" }
    ]
  },
  {
    id: 52,
    name: "Kaveri Embroidered Silk Shirt Co-ord Set",
    slug: "kaveri-embroidered-silk-shirt-coord-set",
    description: "An elegant champagne gold silk shirt-style co-ord set. Highlights intricate multi-color floral embroidery on the cuffs, placket, and trouser hems, combining classic tailoring with royal Indian heritage.",
    fabric: "Handloom Chanderi Silk",
    care_instructions: "Dry clean only.",
    category_id: 1,
    category: categories[0],
    base_price: 4600,
    mrp: 5800,
    sku: "MBK-CO-052",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 29,
    tags: ["silk","embroidered","luxury","champagne"],
    created_at: "2026-08-01T10:10:00.000Z",
    variants: [
      { id: 521, product_id: 52, size: "S", color: "Champagne Gold", color_hex: "#F7E7CE", sku: "MBK-CO-052-S", stock_qty: 12 },
      { id: 522, product_id: 52, size: "M", color: "Champagne Gold", color_hex: "#F7E7CE", sku: "MBK-CO-052-M", stock_qty: 14 },
      { id: 523, product_id: 52, size: "L", color: "Champagne Gold", color_hex: "#F7E7CE", sku: "MBK-CO-052-L", stock_qty: 9 }
    ],
    images: [
      { id: 521, product_id: 52, image_url: "/coord-3.jpg", sort_order: 0, alt_text: "Kaveri Embroidered Silk Shirt Co-ord Set" }
    ]
  },
  {
    id: 53,
    name: "Vaidehi Royal Blue Linen Co-ord Set",
    slug: "vaidehi-royal-blue-linen-coord-set",
    description: "A chic royal blue tailored co-ord set featuring a mandarin collar button-down tunic top with roll-up sleeve tabs and relaxed wide-leg crop pants. Perfect for everyday office chic or casual luncheons.",
    fabric: "Pure Organic Linen",
    care_instructions: "Machine wash cold on gentle cycle.",
    category_id: 1,
    category: categories[0],
    base_price: 2950,
    mrp: 3700,
    sku: "MBK-CO-053",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.6,
    review_count: 34,
    tags: ["linen","royal-blue","workwear","everyday"],
    created_at: "2026-08-01T10:12:00.000Z",
    variants: [
      { id: 531, product_id: 53, size: "S", color: "Royal Blue", color_hex: "#2B4C7E", sku: "MBK-CO-053-S", stock_qty: 18 },
      { id: 532, product_id: 53, size: "M", color: "Royal Blue", color_hex: "#2B4C7E", sku: "MBK-CO-053-M", stock_qty: 22 },
      { id: 533, product_id: 53, size: "L", color: "Royal Blue", color_hex: "#2B4C7E", sku: "MBK-CO-053-L", stock_qty: 11 }
    ],
    images: [
      { id: 531, product_id: 53, image_url: "/coord-4.jpg", sort_order: 0, alt_text: "Vaidehi Royal Blue Linen Co-ord Set" }
    ]
  },
  {
    id: 54,
    name: "Vasundhara Botanical Print Fusion Co-ord Set",
    slug: "vasundhara-botanical-print-fusion-coord-set",
    description: "A vibrant multi-color botanical floral print co-ord set featuring a soft peach and teal collar tunic with three-quarter sleeves and matching high-waisted flared trousers.",
    fabric: "Modal Rayon Blend",
    care_instructions: "Gentle hand wash cold.",
    category_id: 1,
    category: categories[0],
    base_price: 3100,
    mrp: 3900,
    sku: "MBK-CO-054",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 26,
    tags: ["botanical","floral","fusion","rayon"],
    created_at: "2026-08-01T10:15:00.000Z",
    variants: [
      { id: 541, product_id: 54, size: "S", color: "Peach & Teal", color_hex: "#F8B195", sku: "MBK-CO-054-S", stock_qty: 14 },
      { id: 542, product_id: 54, size: "M", color: "Peach & Teal", color_hex: "#F8B195", sku: "MBK-CO-054-M", stock_qty: 19 },
      { id: 543, product_id: 54, size: "L", color: "Peach & Teal", color_hex: "#F8B195", sku: "MBK-CO-054-L", stock_qty: 10 }
    ],
    images: [
      { id: 541, product_id: 54, image_url: "/coord-5.jpg", sort_order: 0, alt_text: "Vasundhara Botanical Print Fusion Co-ord Set" }
    ]
  },
  {
    id: 55,
    name: "Meera Maroon Embroidered Beige Linen Co-ord Set",
    slug: "meera-maroon-embroidered-beige-linen-coord-set",
    description: "A serene beige handloom linen tunic and palazzo set. Features intricate maroon yoke embroidery, flared three-quarter sleeves, a split notch neckline, and matching embroidered hem trousers.",
    fabric: "Handloom Cotton-Linen Blend",
    care_instructions: "Hand wash cold separately.",
    category_id: 1,
    category: categories[0],
    base_price: 3400,
    mrp: 4200,
    sku: "MBK-CO-055",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 31,
    tags: ["linen","beige","embroidered","new-arrival"],
    created_at: "2026-08-01T10:20:00.000Z",
    variants: [
      { id: 551, product_id: 55, size: "S", color: "Beige & Maroon", color_hex: "#F5F5DC", sku: "MBK-CO-055-S", stock_qty: 12 },
      { id: 552, product_id: 55, size: "M", color: "Beige & Maroon", color_hex: "#F5F5DC", sku: "MBK-CO-055-M", stock_qty: 18 },
      { id: 553, product_id: 55, size: "L", color: "Beige & Maroon", color_hex: "#F5F5DC", sku: "MBK-CO-055-L", stock_qty: 10 }
    ],
    images: [
      { id: 551, product_id: 55, image_url: "/coord-6.jpg", sort_order: 0, alt_text: "Meera Maroon Embroidered Beige Linen Co-ord Set" }
    ]
  },
  {
    id: 56,
    name: "Maitreyi Olive Leaf Print Silk Shirt Co-ord Set",
    slug: "maitreyi-olive-leaf-print-silk-shirt-coord-set",
    description: "An elegant sage olive silk shirt tunic and pants set decorated with delicate botanical leaf prints. Styled with a classic collar, button-down front, and wide relaxed trousers.",
    fabric: "Mulberry Silk Blend",
    care_instructions: "Dry clean recommended.",
    category_id: 1,
    category: categories[0],
    base_price: 3850,
    mrp: 4800,
    sku: "MBK-CO-056",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 42,
    tags: ["silk","olive","botanical","bestseller"],
    created_at: "2026-08-01T10:21:00.000Z",
    variants: [
      { id: 561, product_id: 56, size: "S", color: "Sage Olive", color_hex: "#9CAF88", sku: "MBK-CO-056-S", stock_qty: 14 },
      { id: 562, product_id: 56, size: "M", color: "Sage Olive", color_hex: "#9CAF88", sku: "MBK-CO-056-M", stock_qty: 19 },
      { id: 563, product_id: 56, size: "L", color: "Sage Olive", color_hex: "#9CAF88", sku: "MBK-CO-056-L", stock_qty: 9 }
    ],
    images: [
      { id: 561, product_id: 56, image_url: "/coord-7.jpg", sort_order: 0, alt_text: "Maitreyi Olive Leaf Print Silk Shirt Co-ord Set" }
    ]
  },
  {
    id: 57,
    name: "Padmini Yellow Double-Breasted Jacket Co-ord Set",
    slug: "padmini-yellow-double-breasted-jacket-coord-set",
    description: "A cheerful marigold yellow double-breasted jacket tunic paired with matching wide-leg trousers. Embellished with subtle white floral print motifs and wooden button accents.",
    fabric: "Pure Organic Cotton",
    care_instructions: "Machine wash cold gentle.",
    category_id: 1,
    category: categories[0],
    base_price: 3200,
    mrp: 4000,
    sku: "MBK-CO-057",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 28,
    tags: ["cotton","yellow","jacket","cheerful"],
    created_at: "2026-08-01T10:22:00.000Z",
    variants: [
      { id: 571, product_id: 57, size: "S", color: "Marigold Yellow", color_hex: "#EAA221", sku: "MBK-CO-057-S", stock_qty: 11 },
      { id: 572, product_id: 57, size: "M", color: "Marigold Yellow", color_hex: "#EAA221", sku: "MBK-CO-057-M", stock_qty: 15 },
      { id: 573, product_id: 57, size: "L", color: "Marigold Yellow", color_hex: "#EAA221", sku: "MBK-CO-057-L", stock_qty: 8 }
    ],
    images: [
      { id: 571, product_id: 57, image_url: "/coord-8.jpg", sort_order: 0, alt_text: "Padmini Yellow Double-Breasted Jacket Co-ord Set" }
    ]
  },
  {
    id: 58,
    name: "Vartika Abstract Pastel Marble Print Silk Co-ord Set",
    slug: "vartika-abstract-pastel-marble-print-silk-coord-set",
    description: "An artistic multi-color pastel marble print silk co-ord set. Features a button-down collar shirt top and flowing wide trousers in soft swirling hues of turquoise, peach, and coral.",
    fabric: "Satin Silk",
    care_instructions: "Dry clean only.",
    category_id: 1,
    category: categories[0],
    base_price: 4400,
    mrp: 5600,
    sku: "MBK-CO-058",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 36,
    tags: ["silk","marble-print","abstract","pastel"],
    created_at: "2026-08-01T10:23:00.000Z",
    variants: [
      { id: 581, product_id: 58, size: "S", color: "Multi Pastel", color_hex: "#FFD1DC", sku: "MBK-CO-058-S", stock_qty: 13 },
      { id: 582, product_id: 58, size: "M", color: "Multi Pastel", color_hex: "#FFD1DC", sku: "MBK-CO-058-M", stock_qty: 17 },
      { id: 583, product_id: 58, size: "L", color: "Multi Pastel", color_hex: "#FFD1DC", sku: "MBK-CO-058-L", stock_qty: 10 }
    ],
    images: [
      { id: 581, product_id: 58, image_url: "/coord-9.jpg", sort_order: 0, alt_text: "Vartika Abstract Pastel Marble Print Silk Co-ord Set" }
    ]
  },
  


  {
    id: 501,
    name: "Mehrunissa Royal Velvet Bridal Lehenga",
    slug: "mehrunissa-royal-velvet-bridal-lehenga",
    description: "Exquisite deep maroon velvet bridal lehenga detailed with handcrafted Zardozi gold wire needlework, antique sequins, and heavy flared Kalis. Paired with a sweetheart blouse and embroidered net dupatta.",
    fabric: "Royal Silk Velvet & Organza",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 24999,
    mrp: 34999,
    sku: "MBK-LHG-501",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 84,
    tags: ["bridal", "lehenga", "velvet", "zardozi"],
    created_at: "2026-01-28T10:00:00Z",
    variants: [
      { id: 5011, product_id: 501, size: "S", color: "Maroon & Gold", color_hex: "#800020", sku: "MBK-LHG-501-S", stock_qty: 6 },
      { id: 5012, product_id: 501, size: "M", color: "Maroon & Gold", color_hex: "#800020", sku: "MBK-LHG-501-M", stock_qty: 10 },
      { id: 5013, product_id: 501, size: "L", color: "Maroon & Gold", color_hex: "#800020", sku: "MBK-LHG-501-L", stock_qty: 8 },
      { id: 5014, product_id: 501, size: "XL", color: "Maroon & Gold", color_hex: "#800020", sku: "MBK-LHG-501-XL", stock_qty: 4 }
    ],
    images: [
      { id: 5011, product_id: 501, image_url: "/lehenga-1.jpg", sort_order: 1, alt_text: "Mehrunissa Royal Velvet Bridal Lehenga" }
    ]
  },
  {
    id: 502,
    name: "Kaveri Zardozi Crimson Silk Lehenga",
    slug: "kaveri-zardozi-crimson-silk-lehenga",
    description: "Heritage crimson raw silk lehenga featuring antique gold Dori work, floral Kalis, and a richly embellished borders. Ideal for grand wedding receptions and Sangeet nights.",
    fabric: "Pure Raw Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 18999,
    mrp: 26999,
    sku: "MBK-LHG-502",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 56,
    tags: ["festive", "lehenga", "raw-silk", "crimson"],
    created_at: "2026-01-26T10:00:00Z",
    variants: [
      { id: 5021, product_id: 502, size: "S", color: "Crimson Red", color_hex: "#990000", sku: "MBK-LHG-502-S", stock_qty: 8 },
      { id: 5022, product_id: 502, size: "M", color: "Crimson Red", color_hex: "#990000", sku: "MBK-LHG-502-M", stock_qty: 12 },
      { id: 5023, product_id: 502, size: "L", color: "Crimson Red", color_hex: "#990000", sku: "MBK-LHG-502-L", stock_qty: 5 }
    ],
    images: [
      { id: 5021, product_id: 502, image_url: "/lehenga-2.jpg", sort_order: 1, alt_text: "Kaveri Zardozi Crimson Silk Lehenga" }
    ]
  },
  {
    id: 503,
    name: "Noor Bandhani Rani Pink Lehenga",
    slug: "noor-bandhani-rani-pink-lehenga",
    description: "Vibrant Rani Pink silk lehenga with authentic hand-tied Bandhani patterns, mirror-work blouse, and a contrasting saffron organza dupatta.",
    fabric: "Georgette & Bandhani Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 14999,
    mrp: 21999,
    sku: "MBK-LHG-503",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 72,
    tags: ["bandhani", "lehenga", "rani-pink", "mehendi"],
    created_at: "2026-01-24T10:00:00Z",
    variants: [
      { id: 5031, product_id: 503, size: "S", color: "Rani Pink", color_hex: "#E0115F", sku: "MBK-LHG-503-S", stock_qty: 10 },
      { id: 5032, product_id: 503, size: "M", color: "Rani Pink", color_hex: "#E0115F", sku: "MBK-LHG-503-M", stock_qty: 14 },
      { id: 5033, product_id: 503, size: "L", color: "Rani Pink", color_hex: "#E0115F", sku: "MBK-LHG-503-L", stock_qty: 9 }
    ],
    images: [
      { id: 5031, product_id: 503, image_url: "/lehenga-3.jpg", sort_order: 1, alt_text: "Noor Bandhani Rani Pink Lehenga" }
    ]
  },
  {
    id: 504,
    name: "Anaya Emerald Gota Patti Flared Lehenga",
    slug: "anaya-emerald-gota-patti-flared-lehenga",
    description: "Deep emerald green silk lehenga featuring intricate Rajasthani Gota Patti leaf motif appliqué work and a lightweight organza dupatta.",
    fabric: "Chanderi & Organza Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 16499,
    mrp: 22999,
    sku: "MBK-LHG-504",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 41,
    tags: ["emerald", "gota-patti", "lehenga", "wedding"],
    created_at: "2026-01-22T10:00:00Z",
    variants: [
      { id: 5041, product_id: 504, size: "S", color: "Emerald Green", color_hex: "#046307", sku: "MBK-LHG-504-S", stock_qty: 7 },
      { id: 5042, product_id: 504, size: "M", color: "Emerald Green", color_hex: "#046307", sku: "MBK-LHG-504-M", stock_qty: 11 },
      { id: 5043, product_id: 504, size: "L", color: "Emerald Green", color_hex: "#046307", sku: "MBK-LHG-504-L", stock_qty: 6 }
    ],
    images: [
      { id: 5041, product_id: 504, image_url: "/lehenga-4.jpg", sort_order: 1, alt_text: "Anaya Emerald Gota Patti Flared Lehenga" }
    ]
  },
  {
    id: 505,
    name: "Sitara Champagne Gold Net Lehenga",
    slug: "sitara-champagne-gold-net-lehenga",
    description: "Ethereal champagne gold lehenga intricately embroidered with fine metallic sequins, bugle beads, and crystal highlights.",
    fabric: "Soft French Net & Satin Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 19999,
    mrp: 27999,
    sku: "MBK-LHG-505",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 5.0,
    review_count: 63,
    tags: ["champagne-gold", "sequins", "lehenga", "reception"],
    created_at: "2026-01-20T10:00:00Z",
    variants: [
      { id: 5051, product_id: 505, size: "S", color: "Champagne Gold", color_hex: "#F7ECDE", sku: "MBK-LHG-505-S", stock_qty: 5 },
      { id: 5052, product_id: 505, size: "M", color: "Champagne Gold", color_hex: "#F7ECDE", sku: "MBK-LHG-505-M", stock_qty: 9 },
      { id: 5053, product_id: 505, size: "L", color: "Champagne Gold", color_hex: "#F7ECDE", sku: "MBK-LHG-505-L", stock_qty: 4 }
    ],
    images: [
      { id: 5051, product_id: 505, image_url: "/lehenga-5.jpg", sort_order: 1, alt_text: "Sitara Champagne Gold Net Lehenga" }
    ]
  },
  {
    id: 506,
    name: "Gulzar Saffron Organza Festive Lehenga",
    slug: "gulzar-saffron-organza-festive-lehenga",
    description: "Lightweight saffron yellow organza lehenga styled with delicate hand-printed floral motifs and gold lace borders.",
    fabric: "Pure Tissue Organza",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 12999,
    mrp: 17999,
    sku: "MBK-LHG-506",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 38,
    tags: ["saffron", "organza", "haldi", "lehenga"],
    created_at: "2026-01-18T10:00:00Z",
    variants: [
      { id: 5061, product_id: 506, size: "S", color: "Saffron Yellow", color_hex: "#FFC107", sku: "MBK-LHG-506-S", stock_qty: 8 },
      { id: 5062, product_id: 506, size: "M", color: "Saffron Yellow", color_hex: "#FFC107", sku: "MBK-LHG-506-M", stock_qty: 12 },
      { id: 5063, product_id: 506, size: "L", color: "Saffron Yellow", color_hex: "#FFC107", sku: "MBK-LHG-506-L", stock_qty: 6 }
    ],
    images: [
      { id: 5061, product_id: 506, image_url: "/lehenga-6.jpg", sort_order: 1, alt_text: "Gulzar Saffron Organza Festive Lehenga" }
    ]
  },
  {
    id: 507,
    name: "Riwaaz Pastel Blush Sequined Lehenga",
    slug: "riwaaz-pastel-blush-sequined-lehenga",
    description: "Romantic dusty blush pink lehenga with all-over tonal sequin embroidery, plunging neckline blouse, and ruffled net dupatta.",
    fabric: "Georgette & Net",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 15999,
    mrp: 21999,
    sku: "MBK-LHG-507",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 51,
    tags: ["blush-pink", "pastel", "sequins", "lehenga"],
    created_at: "2026-01-15T10:00:00Z",
    variants: [
      { id: 5071, product_id: 507, size: "S", color: "Blush Pink", color_hex: "#FFB6C1", sku: "MBK-LHG-507-S", stock_qty: 9 },
      { id: 5072, product_id: 507, size: "M", color: "Blush Pink", color_hex: "#FFB6C1", sku: "MBK-LHG-507-M", stock_qty: 15 },
      { id: 5073, product_id: 507, size: "L", color: "Blush Pink", color_hex: "#FFB6C1", sku: "MBK-LHG-507-L", stock_qty: 7 }
    ],
    images: [
      { id: 5071, product_id: 507, image_url: "/lehenga-7.jpg", sort_order: 1, alt_text: "Riwaaz Pastel Blush Sequined Lehenga" }
    ]
  },
  {
    id: 508,
    name: "Zoya Velvet Heavy Kalidar Lehenga",
    slug: "zoya-velvet-heavy-kalidar-lehenga",
    description: "Opulent midnight navy velvet lehenga with heavy 16-Kali flare, intricate zari embroidery, and heavily border-worked dupatta.",
    fabric: "Micro Velvet & Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 22999,
    mrp: 31999,
    sku: "MBK-LHG-508",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 67,
    tags: ["navy-blue", "velvet", "bridal", "lehenga"],
    created_at: "2026-01-12T10:00:00Z",
    variants: [
      { id: 5081, product_id: 508, size: "S", color: "Midnight Navy", color_hex: "#000080", sku: "MBK-LHG-508-S", stock_qty: 5 },
      { id: 5082, product_id: 508, size: "M", color: "Midnight Navy", color_hex: "#000080", sku: "MBK-LHG-508-M", stock_qty: 10 },
      { id: 5083, product_id: 508, size: "L", color: "Midnight Navy", color_hex: "#000080", sku: "MBK-LHG-508-L", stock_qty: 4 }
    ],
    images: [
      { id: 5081, product_id: 508, image_url: "/lehenga-8.jpg", sort_order: 1, alt_text: "Zoya Velvet Heavy Kalidar Lehenga" }
    ]
  },
  {
    id: 509,
    name: "Shanaya Ivory Mirrorwork Party Lehenga",
    slug: "shanaya-ivory-mirrorwork-party-lehenga",
    description: "Sleek ivory raw silk lehenga embellished with geometric gold mirrorwork and delicate latkan tassels.",
    fabric: "Raw Silk & Net",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 17499,
    mrp: 23999,
    sku: "MBK-LHG-509",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 29,
    tags: ["ivory", "mirrorwork", "lehenga"],
    created_at: "2026-01-10T10:00:00Z",
    variants: [
      { id: 5091, product_id: 509, size: "S", color: "Ivory & Gold", color_hex: "#FFFFF0", sku: "MBK-LHG-509-S", stock_qty: 6 },
      { id: 5092, product_id: 509, size: "M", color: "Ivory & Gold", color_hex: "#FFFFF0", sku: "MBK-LHG-509-M", stock_qty: 11 }
    ],
    images: [
      { id: 5091, product_id: 509, image_url: "/lehenga-9.jpg", sort_order: 1, alt_text: "Shanaya Ivory Mirrorwork Party Lehenga" }
    ]
  },
  {
    id: 510,
    name: "Kashish Powder Blue Brocade Lehenga",
    slug: "kashish-powder-blue-brocade-lehenga",
    description: "Serene powder blue Banarasi brocade lehenga with silver zari motifs and an illusion net blouse.",
    fabric: "Banarasi Silk Brocade",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 18499,
    mrp: 24999,
    sku: "MBK-LHG-510",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 45,
    tags: ["powder-blue", "brocade", "lehenga"],
    created_at: "2026-01-08T10:00:00Z",
    variants: [
      { id: 5101, product_id: 510, size: "S", color: "Powder Blue", color_hex: "#B0E0E6", sku: "MBK-LHG-510-S", stock_qty: 4 },
      { id: 5102, product_id: 510, size: "M", color: "Powder Blue", color_hex: "#B0E0E6", sku: "MBK-LHG-510-M", stock_qty: 8 }
    ],
    images: [
      { id: 5101, product_id: 510, image_url: "/lehenga-10.jpg", sort_order: 1, alt_text: "Kashish Powder Blue Brocade Lehenga" }
    ]
  },
  {
    id: 511,
    name: "Roshni Plum Gold Jacquard Lehenga",
    slug: "roshni-plum-gold-jacquard-lehenga",
    description: "Rich deep plum purple jacquard silk lehenga with woven metallic flora and an embroidered scalloped dupatta.",
    fabric: "Jacquard Silk & Chiffon",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 16999,
    mrp: 22499,
    sku: "MBK-LHG-511",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.7,
    review_count: 33,
    tags: ["plum", "jacquard", "lehenga"],
    created_at: "2026-01-05T10:00:00Z",
    variants: [
      { id: 5111, product_id: 511, size: "S", color: "Plum Purple", color_hex: "#BDA0CB", sku: "MBK-LHG-511-S", stock_qty: 7 },
      { id: 5112, product_id: 511, size: "M", color: "Plum Purple", color_hex: "#BDA0CB", sku: "MBK-LHG-511-M", stock_qty: 9 }
    ],
    images: [
      { id: 5111, product_id: 511, image_url: "/lehenga-11.jpg", sort_order: 1, alt_text: "Roshni Plum Gold Jacquard Lehenga" }
    ]
  },
  {
    id: 512,
    name: "Mahira Terracotta Handloom Silk Lehenga",
    slug: "mahira-terracotta-handloom-silk-lehenga",
    description: "Earthy terracotta clay handloom silk lehenga with hand-embroidered Zardozi belt and sheer dupatta.",
    fabric: "100% Handloom Silk",
    care_instructions: "Dry clean only.",
    category_id: 5,
    category: categories[4],
    base_price: 21999,
    mrp: 29999,
    sku: "MBK-LHG-512",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 5.0,
    review_count: 58,
    tags: ["terracotta", "handloom", "lehenga"],
    created_at: "2026-01-02T10:00:00Z",
    variants: [
      { id: 5121, product_id: 512, size: "S", color: "Terracotta", color_hex: "#C36A4D", sku: "MBK-LHG-512-S", stock_qty: 5 },
      { id: 5122, product_id: 512, size: "M", color: "Terracotta", color_hex: "#C36A4D", sku: "MBK-LHG-512-M", stock_qty: 10 }
    ],
    images: [
      { id: 5121, product_id: 512, image_url: "/lehenga-12.jpg", sort_order: 1, alt_text: "Mahira Terracotta Handloom Silk Lehenga" }
    ]
  },
  {
    id: 102,
    name: "Kiara Boho Asymmetric Cape Kurti",
    slug: "kiara-boho-asymmetric-cape-kurti",
    description: "Flattering blush pink asymmetric cape kurti detailed with delicate gold mirror accents and paired with sleek flared trousers. Youthful, lightweight, and effortlessly chic.",
    fabric: "Georgette & Chanderi Blend",
    care_instructions: "Dry clean only.",
    category_id: 4,
    category: categories[3],
    base_price: 3899,
    mrp: 5499,
    sku: "MBK-GZ-002",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 62,
    tags: ["gen-z","cape-kurti","boho","fusion"],
    created_at: "2026-01-21T10:00:00Z",
    variants: [
      { id: 1021, product_id: 102, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-002-XS", stock_qty: 10 },
      { id: 1022, product_id: 102, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-002-S", stock_qty: 15 },
      { id: 1023, product_id: 102, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-002-M", stock_qty: 20 },
      { id: 1024, product_id: 102, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-002-L", stock_qty: 12 },
      { id: 1025, product_id: 102, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-002-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1021, product_id: 102, image_url: "/gen-z-wear-2.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 103,
    name: "Tara Halter-Neck Printed Fusion Jumpsuit",
    slug: "tara-halter-neck-printed-fusion-jumpsuit",
    description: "A statement terracotta and ivory halter-neck jumpsuit featuring artisan hand-block motifs. Modern silhouette with comfortable pockets and soft waist cinching.",
    fabric: "100% Handloom Cotton",
    care_instructions: "Gentle machine wash with mild detergent.",
    category_id: 4,
    category: categories[3],
    base_price: 4299,
    mrp: 5999,
    sku: "MBK-GZ-003",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 95,
    tags: ["gen-z","jumpsuit","hand-block","terracotta"],
    created_at: "2026-01-22T10:00:00Z",
    variants: [
      { id: 1031, product_id: 103, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-003-XS", stock_qty: 10 },
      { id: 1032, product_id: 103, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-003-S", stock_qty: 15 },
      { id: 1033, product_id: 103, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-003-M", stock_qty: 20 },
      { id: 1034, product_id: 103, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-003-L", stock_qty: 12 },
      { id: 1035, product_id: 103, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-003-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1031, product_id: 103, image_url: "/gen-z-wear-3.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 104,
    name: "Zoya Block-Print Wrap Top & Trouser Set",
    slug: "zoya-block-print-wrap-top-trouser-set",
    description: "Vibrant sage green and cream wrap-around top paired with high-waisted wide-leg trousers. Breathable cotton silhouette suited for coffee dates and festive brunches.",
    fabric: "Premium Mulmul Cotton",
    care_instructions: "Cold hand wash separately.",
    category_id: 4,
    category: categories[3],
    base_price: 3699,
    mrp: 5199,
    sku: "MBK-GZ-004",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 51,
    tags: ["gen-z","wrap-top","sage-green","fusion-set"],
    created_at: "2026-01-23T10:00:00Z",
    variants: [
      { id: 1041, product_id: 104, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-004-XS", stock_qty: 10 },
      { id: 1042, product_id: 104, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-004-S", stock_qty: 15 },
      { id: 1043, product_id: 104, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-004-M", stock_qty: 20 },
      { id: 1044, product_id: 104, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-004-L", stock_qty: 12 },
      { id: 1045, product_id: 104, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-004-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1041, product_id: 104, image_url: "/gen-z-wear-4.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 105,
    name: "Anaya Crop Jacket & Tiered Skirt Set",
    slug: "anaya-crop-jacket-tiered-skirt-set",
    description: "Ethereal dusty lavender short embroidered jacket paired with a voluminous high-waisted tiered maxi skirt. A playful spin on festive fusion wear.",
    fabric: "Organza & Silk Blend",
    care_instructions: "Dry clean only.",
    category_id: 4,
    category: categories[3],
    base_price: 4999,
    mrp: 6999,
    sku: "MBK-GZ-005",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 110,
    tags: ["gen-z","tiered-skirt","jacket-set","lavender"],
    created_at: "2026-01-24T10:00:00Z",
    variants: [
      { id: 1051, product_id: 105, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-005-XS", stock_qty: 10 },
      { id: 1052, product_id: 105, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-005-S", stock_qty: 15 },
      { id: 1053, product_id: 105, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-005-M", stock_qty: 20 },
      { id: 1054, product_id: 105, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-005-L", stock_qty: 12 },
      { id: 1055, product_id: 105, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-005-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1051, product_id: 105, image_url: "/gen-z-wear-5.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 106,
    name: "Suhani Indigo Draped Belted Tunic",
    slug: "suhani-indigo-draped-belted-tunic",
    description: "Deep indigo blue draped tunic with a tailored fabric belt and delicate silver thread accents. Minimalist yet striking Indo-western aesthetic.",
    fabric: "Rayon Slub & Silver Thread",
    care_instructions: "Dry clean first wash, then hand wash cold.",
    category_id: 4,
    category: categories[3],
    base_price: 3299,
    mrp: 4699,
    sku: "MBK-GZ-006",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 47,
    tags: ["gen-z","indigo","draped-tunic","belted"],
    created_at: "2026-01-25T10:00:00Z",
    variants: [
      { id: 1061, product_id: 106, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-006-XS", stock_qty: 10 },
      { id: 1062, product_id: 106, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-006-S", stock_qty: 15 },
      { id: 1063, product_id: 106, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-006-M", stock_qty: 20 },
      { id: 1064, product_id: 106, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-006-L", stock_qty: 12 },
      { id: 1065, product_id: 106, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-006-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1061, product_id: 106, image_url: "/gen-z-wear-6.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 107,
    name: "Nisha Cut-Out Boho Maxi Dress",
    slug: "nisha-cut-out-boho-maxi-dress",
    description: "Mustard yellow and white waist cut-out maxi dress with artisanal floral prints. Designed for breezy summer evenings and music festivals.",
    fabric: "100% Breathable Cotton",
    care_instructions: "Machine wash cold on gentle cycle.",
    category_id: 4,
    category: categories[3],
    base_price: 3999,
    mrp: 5699,
    sku: "MBK-GZ-007",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 39,
    tags: ["gen-z","boho-dress","cut-out","mustard"],
    created_at: "2026-01-26T10:00:00Z",
    variants: [
      { id: 1071, product_id: 107, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-007-XS", stock_qty: 10 },
      { id: 1072, product_id: 107, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-007-S", stock_qty: 15 },
      { id: 1073, product_id: 107, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-007-M", stock_qty: 20 },
      { id: 1074, product_id: 107, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-007-L", stock_qty: 12 },
      { id: 1075, product_id: 107, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-007-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1071, product_id: 107, image_url: "/gen-z-wear-7.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 108,
    name: "Anya Pleated Fusion Shirt Kurta",
    slug: "anya-pleated-fusion-shirt-kurta",
    description: "Soft mint green pleated shirt-kurta with cuff details and tailored cigarette pants. Clean, modern aesthetic tailored for college and office wear.",
    fabric: "Cotton-Linen Blend",
    care_instructions: "Warm iron. Dry clean recommended.",
    category_id: 4,
    category: categories[3],
    base_price: 3199,
    mrp: 4499,
    sku: "MBK-GZ-008",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 58,
    tags: ["gen-z","shirt-kurta","mint-green","workwear"],
    created_at: "2026-01-27T10:00:00Z",
    variants: [
      { id: 1081, product_id: 108, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-008-XS", stock_qty: 10 },
      { id: 1082, product_id: 108, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-008-S", stock_qty: 15 },
      { id: 1083, product_id: 108, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-008-M", stock_qty: 20 },
      { id: 1084, product_id: 108, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-008-L", stock_qty: 12 },
      { id: 1085, product_id: 108, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-008-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1081, product_id: 108, image_url: "/gen-z-wear-8.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 109,
    name: "Rhea Embroidered Vest & Palazzo Set",
    slug: "rhea-embroidered-vest-palazzo-set",
    description: "Rust orange wide palazzo pants paired with a white cotton tunic and a zardozi-embroidered vest. Rich in texture, comfortable to move in.",
    fabric: "Chanderi Vest & Slub Cotton",
    care_instructions: "Dry clean only.",
    category_id: 4,
    category: categories[3],
    base_price: 4599,
    mrp: 6499,
    sku: "MBK-GZ-009",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 76,
    tags: ["gen-z","vest-set","palazzo","rust-orange"],
    created_at: "2026-01-28T10:00:00Z",
    variants: [
      { id: 1091, product_id: 109, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-009-XS", stock_qty: 10 },
      { id: 1092, product_id: 109, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-009-S", stock_qty: 15 },
      { id: 1093, product_id: 109, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-009-M", stock_qty: 20 },
      { id: 1094, product_id: 109, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-009-L", stock_qty: 12 },
      { id: 1095, product_id: 109, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-009-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1091, product_id: 109, image_url: "/gen-z-wear-9.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 110,
    name: "Diya High-Low Layered Fusion Tunic",
    slug: "diya-high-low-layered-fusion-tunic",
    description: "Vibrant coral pink asymmetrical high-low tunic adorned with subtle geometric threadwork, paired with crisp white trousers.",
    fabric: "Crepe & Georgette",
    care_instructions: "Gentle hand wash in cold water.",
    category_id: 4,
    category: categories[3],
    base_price: 3799,
    mrp: 5299,
    sku: "MBK-GZ-010",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 42,
    tags: ["gen-z","high-low","coral-pink","fusion-tunic"],
    created_at: "2026-01-29T10:00:00Z",
    variants: [
      { id: 1101, product_id: 110, size: "XS", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-010-XS", stock_qty: 10 },
      { id: 1102, product_id: 110, size: "S", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-010-S", stock_qty: 15 },
      { id: 1103, product_id: 110, size: "M", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-010-M", stock_qty: 20 },
      { id: 1104, product_id: 110, size: "L", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-010-L", stock_qty: 12 },
      { id: 1105, product_id: 110, size: "XL", color: "Standard", color_hex: "#E8D5C4", sku: "MBK-GZ-010-XL", stock_qty: 8 }
    ],
    images: [
      { id: 1101, product_id: 110, image_url: "/gen-z-wear-10.jpg", sort_order: 1, alt_text: "Product image" }
    ]
  },
  {
    id: 5,
    name: "Zara Fusion Maxi Dress",
    slug: "zara-fusion-maxi-dress",
    description: "A breezy maxi dress that blends Indian sensibility with contemporary ease. Featuring a smocked bodice, flutter sleeves, and an anarkali-inspired flared skirt in lightweight rayon with subtle ikkat print. Perfect for brunches, holidays, and casual evenings.",
    fabric: "Rayon Ikkat",
    care_instructions: "Machine wash cold, gentle cycle. Do not tumble dry.",
    category_id: 2,
    category: categories[1],
    base_price: 2400,
    mrp: 3200,
    sku: "MBK-DR-001",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.5,
    review_count: 318,
    tags: ["fusion","maxi","everyday","bestseller","new-arrival"],
    created_at: "2025-01-10T10:00:00Z",
    variants: [
      {
            "id": 21,
            "product_id": 5,
            "size": "XS",
            "color": "Terracotta",
            "color_hex": "#C4693E",
            "sku": "MBK-DR-001-XS-TC",
            "stock_qty": 20
      },
      {
            "id": 22,
            "product_id": 5,
            "size": "S",
            "color": "Terracotta",
            "color_hex": "#C4693E",
            "sku": "MBK-DR-001-S-TC",
            "stock_qty": 35
      },
      {
            "id": 23,
            "product_id": 5,
            "size": "M",
            "color": "Terracotta",
            "color_hex": "#C4693E",
            "sku": "MBK-DR-001-M-TC",
            "stock_qty": 28
      },
      {
            "id": 24,
            "product_id": 5,
            "size": "L",
            "color": "Terracotta",
            "color_hex": "#C4693E",
            "sku": "MBK-DR-001-L-TC",
            "stock_qty": 15
      },
      {
            "id": 25,
            "product_id": 5,
            "size": "XL",
            "color": "Terracotta",
            "color_hex": "#C4693E",
            "sku": "MBK-DR-001-XL-TC",
            "stock_qty": 8
      },
      {
            "id": 26,
            "product_id": 5,
            "size": "S",
            "color": "Midnight Blue",
            "color_hex": "#1A2B4A",
            "sku": "MBK-DR-001-S-MB",
            "stock_qty": 18
      },
      {
            "id": 27,
            "product_id": 5,
            "size": "M",
            "color": "Midnight Blue",
            "color_hex": "#1A2B4A",
            "sku": "MBK-DR-001-M-MB",
            "stock_qty": 22
      }
],
    images: [
      {
            "id": 11,
            "product_id": 5,
            "image_url": "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=85",
            "sort_order": 0,
            "alt_text": "Zara Fusion Maxi Dress — Terracotta"
      },
      {
            "id": 12,
            "product_id": 5,
            "image_url": "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=85",
            "sort_order": 1,
            "alt_text": "Zara Fusion Dress — ikkat print detail"
      }
]
  },
  {
    id: 70,
    name: "Kavya Multi-Color Georgette Maxi",
    slug: "aadhya-linen-maxi-dress",
    description: "A beautiful flowing maxi dress crafted from premium linen-cotton blend. Features a tiered skirt, elasticated puff sleeves, and subtle hand-embroidery along the neckline. Comfortable and elegant for festive days.",
    fabric: "Linen Cotton Blend",
    care_instructions: "Hand wash cold. Line dry in shade.",
    category_id: 2,
    category: categories[1],
    base_price: 3600,
    mrp: 4200,
    sku: "MBK-MD-070",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 24,
    tags: ["linen","tiered","new-arrival"],
    created_at: "2026-07-30T16:06:51.074Z",
    variants: [
      {
            "id": 4070,
            "product_id": 70,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-070-S",
            "stock_qty": 12
      },
      {
            "id": 5070,
            "product_id": 70,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-070-M",
            "stock_qty": 18
      },
      {
            "id": 6070,
            "product_id": 70,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-070-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4070,
            "product_id": 70,
            "image_url": "/maxi-dress-uploaded-1.jpg",
            "sort_order": 0,
            "alt_text": "Kavya Multi-Color Georgette Maxi"
      }
]
  },
  {
    id: 71,
    name: "Zara Turquoise Tiered Maxi",
    slug: "aditi-silk-flared-maxi-dress",
    description: "A regal flared maxi dress woven from pure Chanderi silk. Features a deep indigo blue hue with gold block-printed borders and a matching silk sash belt.",
    fabric: "Chanderi Silk",
    care_instructions: "Dry clean only. Store wrapped in cotton cloth.",
    category_id: 2,
    category: categories[1],
    base_price: 5200,
    mrp: 6500,
    sku: "MBK-MD-071",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 36,
    tags: ["silk","royal","festive"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4071,
            "product_id": 71,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-071-S",
            "stock_qty": 12
      },
      {
            "id": 5071,
            "product_id": 71,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-071-M",
            "stock_qty": 18
      },
      {
            "id": 6071,
            "product_id": 71,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-071-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4071,
            "product_id": 71,
            "image_url": "/maxi-dress-uploaded-2.jpg",
            "sort_order": 0,
            "alt_text": "Zara Turquoise Tiered Maxi"
      }
]
  },
  {
    id: 72,
    name: "Rhea Black Floral Maxi",
    slug: "bhavana-shibori-maxi-dress",
    description: "Stunning tie-dye Shibori patterns in soft rose pink and coral. Designed with an elegant halter-neck and side slits for a modern fusion silhouette.",
    fabric: "100% Cotton Mulmul",
    care_instructions: "Hand wash separately. Warm iron.",
    category_id: 2,
    category: categories[1],
    base_price: 2900,
    mrp: 3500,
    sku: "MBK-MD-072",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.6,
    review_count: 15,
    tags: ["shibori","cotton","fusion"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4072,
            "product_id": 72,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-072-S",
            "stock_qty": 12
      },
      {
            "id": 5072,
            "product_id": 72,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-072-M",
            "stock_qty": 18
      },
      {
            "id": 6072,
            "product_id": 72,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-072-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4072,
            "product_id": 72,
            "image_url": "/maxi-dress-uploaded-3.jpg",
            "sort_order": 0,
            "alt_text": "Rhea Black Floral Maxi"
      }
]
  },
  {
    id: 73,
    name: "Avani Yellow Floral Maxi",
    slug: "devika-block-print-maxi-dress",
    description: "Traditional Bagh block-printing meets contemporary flared design. Features a buttoned front bodice and beautiful pleated waist details.",
    fabric: "Handloom Cotton",
    care_instructions: "Hand wash cold separately. Mild detergent.",
    category_id: 2,
    category: categories[1],
    base_price: 3200,
    mrp: 3800,
    sku: "MBK-MD-073",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.7,
    review_count: 42,
    tags: ["block-print","cotton","bestseller"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4073,
            "product_id": 73,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-073-S",
            "stock_qty": 12
      },
      {
            "id": 5073,
            "product_id": 73,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-073-M",
            "stock_qty": 18
      },
      {
            "id": 6073,
            "product_id": 73,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-073-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4073,
            "product_id": 73,
            "image_url": "/maxi-dress-uploaded-4.jpg",
            "sort_order": 0,
            "alt_text": "Avani Yellow Floral Maxi"
      }
]
  },
  {
    id: 74,
    name: "Gayatri Pink Floral Maxi",
    slug: "gayatri-cotton-tiered-maxi-dress",
    description: "A breezy tiered maxi dress in soft mustard yellow floral prints. Lined fully with cotton mulmul for ultimate comfort.",
    fabric: "Premium Rayon-Cotton",
    care_instructions: "Machine wash cold on gentle cycle.",
    category_id: 2,
    category: categories[1],
    base_price: 2800,
    mrp: 3200,
    sku: "MBK-MD-074",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.5,
    review_count: 18,
    tags: ["floral","yellow","tiered"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4074,
            "product_id": 74,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-074-S",
            "stock_qty": 12
      },
      {
            "id": 5074,
            "product_id": 74,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-074-M",
            "stock_qty": 18
      },
      {
            "id": 6074,
            "product_id": 74,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-074-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4074,
            "product_id": 74,
            "image_url": "/maxi-dress-uploaded-5.png",
            "sort_order": 0,
            "alt_text": "Gayatri Pink Floral Maxi"
      }
]
  },
  {
    id: 75,
    name: "Kalpana Maroon Lace Maxi",
    slug: "kalpana-terracotta-linen-maxi-dress",
    description: "Comfort-fit daily wear maxi dress in rich terracotta hue. Features a minimalist round neck and functional side pockets.",
    fabric: "Pure Linen",
    care_instructions: "Wash cold. Lay flat to dry.",
    category_id: 2,
    category: categories[1],
    base_price: 3400,
    mrp: 3999,
    sku: "MBK-MD-075",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.4,
    review_count: 11,
    tags: ["linen","terracotta","pockets"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4075,
            "product_id": 75,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-075-S",
            "stock_qty": 12
      },
      {
            "id": 5075,
            "product_id": 75,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-075-M",
            "stock_qty": 18
      },
      {
            "id": 6075,
            "product_id": 75,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-075-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4075,
            "product_id": 75,
            "image_url": "/maxi-dress-uploaded-6.png",
            "sort_order": 0,
            "alt_text": "Kalpana Maroon Lace Maxi"
      }
]
  },
  {
    id: 76,
    name: "Manjari Orchid Floral Maxi",
    slug: "manjari-sage-green-linen-maxi-dress",
    description: "Delicate lace inserts and loop button closures along the front. A soothing sage green colorway for effortless elegance.",
    fabric: "Linen Blend",
    care_instructions: "Hand wash cold separately.",
    category_id: 2,
    category: categories[1],
    base_price: 3100,
    mrp: 3600,
    sku: "MBK-MD-076",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 29,
    tags: ["lace","sage","minimalist"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4076,
            "product_id": 76,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-076-S",
            "stock_qty": 12
      },
      {
            "id": 5076,
            "product_id": 76,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-076-M",
            "stock_qty": 18
      },
      {
            "id": 6076,
            "product_id": 76,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-076-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4076,
            "product_id": 76,
            "image_url": "/maxi-dress-uploaded-7.png",
            "sort_order": 0,
            "alt_text": "Manjari Orchid Floral Maxi"
      }
]
  },
  {
    id: 77,
    name: "Priyamvada Indigo Block Maxi",
    slug: "priyamvada-bandhani-silk-maxi-dress",
    description: "A glorious deep red maxi dress featuring traditional tie-dye Bandhani detailing along the sleeves and flared hem.",
    fabric: "Gaji Silk",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 5400,
    mrp: 6500,
    sku: "MBK-MD-077",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 22,
    tags: ["bandhani","silk","festive"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4077,
            "product_id": 77,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-077-S",
            "stock_qty": 12
      },
      {
            "id": 5077,
            "product_id": 77,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-077-M",
            "stock_qty": 18
      },
      {
            "id": 6077,
            "product_id": 77,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-077-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4077,
            "product_id": 77,
            "image_url": "/maxi-dress-uploaded-8.png",
            "sort_order": 0,
            "alt_text": "Priyamvada Indigo Block Maxi"
      }
]
  },
  {
    id: 78,
    name: "Rupali Off-Shoulder Ruffled Maxi",
    slug: "rupali-black-ikat-cotton-maxi-dress",
    description: "Intricate white and grey geometric Ikat patterns on a deep black cotton base. V-neckline and elegant flared tiers.",
    fabric: "Handloom Cotton Ikat",
    care_instructions: "Wash cold separately with mild soap.",
    category_id: 2,
    category: categories[1],
    base_price: 3300,
    mrp: 3999,
    sku: "MBK-CO-078",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.7,
    review_count: 14,
    tags: ["ikat","black","handloom"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4078,
            "product_id": 78,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-CO-078-S",
            "stock_qty": 12
      },
      {
            "id": 5078,
            "product_id": 78,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-CO-078-M",
            "stock_qty": 18
      },
      {
            "id": 6078,
            "product_id": 78,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-CO-078-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4078,
            "product_id": 78,
            "image_url": "/maxi-dress-uploaded-9.png",
            "sort_order": 0,
            "alt_text": "Rupali Off-Shoulder Ruffled Maxi"
      }
]
  },
  {
    id: 79,
    name: "Samyukta Maroon Embroidered Silk Maxi",
    slug: "samyukta-turquoise-silk-maxi-dress",
    description: "A luxurious flared dress in vibrant turquoise Modal silk. Finished with detailed zari embroidery on cuffs and neckline.",
    fabric: "Modal Silk",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 4800,
    mrp: 5600,
    sku: "MBK-MD-079",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 19,
    tags: ["turquoise","zari","silk"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4079,
            "product_id": 79,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-079-S",
            "stock_qty": 12
      },
      {
            "id": 5079,
            "product_id": 79,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-079-M",
            "stock_qty": 18
      },
      {
            "id": 6079,
            "product_id": 79,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-079-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4079,
            "product_id": 79,
            "image_url": "/maxi-dress-uploaded-10.png",
            "sort_order": 0,
            "alt_text": "Samyukta Maroon Embroidered Silk Maxi"
      }
]
  },
  {
    id: 80,
    name: "Urmila Turquoise Floral Tiered Maxi",
    slug: "urmila-marigold-ikat-maxi-dress",
    description: "Warm yellow handloom Ikat dress featuring a high mandarin collar and comfortable flared sleeves.",
    fabric: "Cotton Ikat",
    care_instructions: "Wash separately. Iron on reverse.",
    category_id: 2,
    category: categories[1],
    base_price: 2990,
    mrp: 3500,
    sku: "MBK-MD-080",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.5,
    review_count: 12,
    tags: ["ikat","yellow","mandarin"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4080,
            "product_id": 80,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-080-S",
            "stock_qty": 12
      },
      {
            "id": 5080,
            "product_id": 80,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-080-M",
            "stock_qty": 18
      },
      {
            "id": 6080,
            "product_id": 80,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-080-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4080,
            "product_id": 80,
            "image_url": "/maxi-dress-uploaded-11.jpg",
            "sort_order": 0,
            "alt_text": "Urmila Turquoise Floral Tiered Maxi"
      }
]
  },
  {
    id: 81,
    name: "Yamini Scarlet Cotton Flare Maxi",
    slug: "yamini-velvet-plum-maxi-dress",
    description: "Luxurious silk velvet winter maxi dress. Accented with deep plum tones and gold hand-zardozi borders.",
    fabric: "Silk Velvet",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 5900,
    mrp: 7200,
    sku: "MBK-MD-081",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 27,
    tags: ["velvet","plum","zardozi"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4081,
            "product_id": 81,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-081-S",
            "stock_qty": 12
      },
      {
            "id": 5081,
            "product_id": 81,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-081-M",
            "stock_qty": 18
      },
      {
            "id": 6081,
            "product_id": 81,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-081-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4081,
            "product_id": 81,
            "image_url": "/maxi-dress-uploaded-12.jpg",
            "sort_order": 0,
            "alt_text": "Yamini Scarlet Cotton Flare Maxi"
      }
]
  },
  {
    id: 82,
    name: "Malini Peach Floral Summer Maxi",
    slug: "malini-taupe-linen-maxi-dress",
    description: "Earth-toned organic linen tailored into a breathable flared maxi dress. Ideal for slow summer days.",
    fabric: "Organic Linen",
    care_instructions: "Wash cold, line dry.",
    category_id: 2,
    category: categories[1],
    base_price: 2700,
    mrp: 3200,
    sku: "MBK-MD-082",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.3,
    review_count: 8,
    tags: ["linen","taupe","minimalist"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4082,
            "product_id": 82,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-082-S",
            "stock_qty": 12
      },
      {
            "id": 5082,
            "product_id": 82,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-082-M",
            "stock_qty": 18
      },
      {
            "id": 6082,
            "product_id": 82,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-082-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4082,
            "product_id": 82,
            "image_url": "/maxi-dress-uploaded-13.png",
            "sort_order": 0,
            "alt_text": "Malini Peach Floral Summer Maxi"
      }
]
  },
  {
    id: 83,
    name: "Niharika Olive Ruffled Tier Maxi",
    slug: "niharika-lilac-blossom-maxi-dress",
    description: "Soft pastel lilac floral printed on sheer silk georgette with a tier skirt detailing.",
    fabric: "Silk Georgette",
    care_instructions: "Dry clean recommended.",
    category_id: 2,
    category: categories[1],
    base_price: 3900,
    mrp: 4600,
    sku: "MBK-MD-083",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.6,
    review_count: 13,
    tags: ["lilac","floral","georgette"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4083,
            "product_id": 83,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-083-S",
            "stock_qty": 12
      },
      {
            "id": 5083,
            "product_id": 83,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-083-M",
            "stock_qty": 18
      },
      {
            "id": 6083,
            "product_id": 83,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-083-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4083,
            "product_id": 83,
            "image_url": "/maxi-dress-uploaded-14.png",
            "sort_order": 0,
            "alt_text": "Niharika Olive Ruffled Tier Maxi"
      }
]
  },
  {
    id: 84,
    name: "Rajeswari Blue Floral Tiered Maxi",
    slug: "rajeswari-charcoal-silk-maxi-dress",
    description: "A stately charcoal grey Tussar silk maxi dress with split collar neckline and refined gold border borders.",
    fabric: "Tussar Silk",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 4600,
    mrp: 5400,
    sku: "MBK-MD-084",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 21,
    tags: ["silk","charcoal","festive"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4084,
            "product_id": 84,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-084-S",
            "stock_qty": 12
      },
      {
            "id": 5084,
            "product_id": 84,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-084-M",
            "stock_qty": 18
      },
      {
            "id": 6084,
            "product_id": 84,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-084-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4084,
            "product_id": 84,
            "image_url": "/maxi-dress-uploaded-15.png",
            "sort_order": 0,
            "alt_text": "Rajeswari Blue Floral Tiered Maxi"
      }
]
  },
  {
    id: 85,
    name: "Shakuntala Black Floral Print Maxi",
    slug: "shakuntala-coral-pink-maxi-dress",
    description: "Coral pink tiers decorated with intricate gota patti border lines along the flared hem.",
    fabric: "Cotton Linen",
    care_instructions: "Hand wash cold separately.",
    category_id: 2,
    category: categories[1],
    base_price: 3100,
    mrp: 3700,
    sku: "MBK-MD-085",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.5,
    review_count: 10,
    tags: ["coral","cotton","gotapatti"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4085,
            "product_id": 85,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-085-S",
            "stock_qty": 12
      },
      {
            "id": 5085,
            "product_id": 85,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-085-M",
            "stock_qty": 18
      },
      {
            "id": 6085,
            "product_id": 85,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-085-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4085,
            "product_id": 85,
            "image_url": "/maxi-dress-uploaded-16.png",
            "sort_order": 0,
            "alt_text": "Shakuntala Black Floral Print Maxi"
      }
]
  },
  {
    id: 86,
    name: "Lalita Classy Black Buttoned Maxi",
    slug: "lalita-mustard-stripes-maxi-dress",
    description: "Vertical handwoven stripes on a mustard cotton base. Features a button-down shirt dress silhouette.",
    fabric: "Handloom Cotton",
    care_instructions: "Wash cold. Iron warm.",
    category_id: 2,
    category: categories[1],
    base_price: 2700,
    mrp: 3200,
    sku: "MBK-MD-086",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.4,
    review_count: 12,
    tags: ["stripes","yellow","shirtdress"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4086,
            "product_id": 86,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-086-S",
            "stock_qty": 12
      },
      {
            "id": 5086,
            "product_id": 86,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-086-M",
            "stock_qty": 18
      },
      {
            "id": 6086,
            "product_id": 86,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-086-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4086,
            "product_id": 86,
            "image_url": "/maxi-dress-uploaded-17.png",
            "sort_order": 0,
            "alt_text": "Lalita Classy Black Buttoned Maxi"
      }
]
  },
  {
    id: 87,
    name: "Kirtida Ivory-Turquoise Floral Maxi",
    slug: "kirtida-royal-blue-maxi-dress",
    description: "Vibrant royal blue crepe maxi dress. Elegant asymmetrical design with a gold border sash belt.",
    fabric: "Modal Silk",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 4200,
    mrp: 4999,
    sku: "MBK-MD-087",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.7,
    review_count: 18,
    tags: ["blue","silk","asymmetrical"],
    created_at: "2026-07-30T16:06:51.077Z",
    variants: [
      {
            "id": 4087,
            "product_id": 87,
            "size": "S",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-087-S",
            "stock_qty": 12
      },
      {
            "id": 5087,
            "product_id": 87,
            "size": "M",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-087-M",
            "stock_qty": 18
      },
      {
            "id": 6087,
            "product_id": 87,
            "size": "L",
            "color": "Blush",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-087-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4087,
            "product_id": 87,
            "image_url": "/maxi-dress-uploaded-18.png",
            "sort_order": 0,
            "alt_text": "Kirtida Ivory-Turquoise Floral Maxi"
      }
]
  },
  {
    id: 88,
    name: "Kalyani Indigo Checked Shirt Maxi",
    slug: "kalyani-maroon-chanderi-maxi-dress",
    description: "A majestic flared maxi dress in rich maroon Chanderi silk. Features exquisite gold hand-embroidery along the collar and a matching silk belt.",
    fabric: "Chanderi Silk",
    care_instructions: "Dry clean only.",
    category_id: 2,
    category: categories[1],
    base_price: 4600,
    mrp: 5400,
    sku: "MBK-MD-088",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 20,
    tags: ["chanderi","maroon","royal"],
    created_at: "2026-07-30T16:10:34.185Z",
    variants: [
      {
            "id": 4088,
            "product_id": 88,
            "size": "S",
            "color": "Maroon",
            "color_hex": "#6A1B29",
            "sku": "MBK-MD-088-S",
            "stock_qty": 15
      },
      {
            "id": 5088,
            "product_id": 88,
            "size": "M",
            "color": "Maroon",
            "color_hex": "#6A1B29",
            "sku": "MBK-MD-088-M",
            "stock_qty": 25
      },
      {
            "id": 6088,
            "product_id": 88,
            "size": "L",
            "color": "Maroon",
            "color_hex": "#6A1B29",
            "sku": "MBK-MD-088-L",
            "stock_qty": 12
      }
],
    images: [
      {
            "id": 4088,
            "product_id": 88,
            "image_url": "/maxi-dress-uploaded-19.png",
            "sort_order": 0,
            "alt_text": "Kalyani Indigo Checked Shirt Maxi"
      }
]
  },
  {
    id: 89,
    name: "Anupama Teal Chiffon Tiered Maxi",
    slug: "anupama-pastel-organza-maxi-dress",
    description: "A dreamy contemporary maxi dress tailored in soft pastel peach organza. Adorned with delicate floral embroidery panels and balloon sleeves.",
    fabric: "Premium Organza",
    care_instructions: "Hand wash cold separately.",
    category_id: 2,
    category: categories[1],
    base_price: 3500,
    mrp: 4100,
    sku: "MBK-MD-089",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 14,
    tags: ["organza","peach","floral"],
    created_at: "2026-07-30T16:10:34.202Z",
    variants: [
      {
            "id": 4089,
            "product_id": 89,
            "size": "S",
            "color": "Peach",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-089-S",
            "stock_qty": 12
      },
      {
            "id": 5089,
            "product_id": 89,
            "size": "M",
            "color": "Peach",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-089-M",
            "stock_qty": 18
      },
      {
            "id": 6089,
            "product_id": 89,
            "size": "L",
            "color": "Peach",
            "color_hex": "#FAF0EB",
            "sku": "MBK-MD-089-L",
            "stock_qty": 8
      }
],
    images: [
      {
            "id": 4089,
            "product_id": 89,
            "image_url": "/maxi-dress-uploaded-20.png",
            "sort_order": 0,
            "alt_text": "Anupama Teal Chiffon Tiered Maxi"
      }
]
  },
  {
    id: 100,
    name: "Aarohi Emerald Anarkali Set",
    slug: "aarohi-emerald-anarkali-set",
    description: "An exquisite dark green silk Anarkali kurta set featuring intricate silver gota patti hand-embroidery along the neckline and cuffs. Comes complete with straight pants and a matching organza dupatta.",
    fabric: "Chanderi Silk & Organza",
    care_instructions: "Dry clean only. Store in a cool, dry place wrapped in cotton muslin.",
    category_id: 3,
    category: categories[2],
    base_price: 5200,
    mrp: 6500,
    sku: "MBK-KT-100",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    rating: 5.0,
    review_count: 14,
    tags: ["anarkali", "festive", "emerald", "chanderi"],
    created_at: "2026-07-30T19:29:59.018Z",
    variants: [
      { id: 9100, product_id: 100, size: "S", color: "Emerald Green", color_hex: "#0A5C36", sku: "MBK-KT-100-S", stock_qty: 15 },
      { id: 9101, product_id: 100, size: "M", color: "Emerald Green", color_hex: "#0A5C36", sku: "MBK-KT-100-M", stock_qty: 20 },
      { id: 9102, product_id: 100, size: "L", color: "Emerald Green", color_hex: "#0A5C36", sku: "MBK-KT-100-L", stock_qty: 12 }
    ],
    images: [
      { id: 9100, product_id: 100, image_url: "/kurti-uploaded-1-high.png", sort_order: 0, alt_text: "Aarohi Emerald Anarkali Set - Front View" },
      { id: 9101, product_id: 100, image_url: "/kurti-uploaded-2.png", sort_order: 1, alt_text: "Ivory Printed Kurta Style" },
      { id: 9102, product_id: 100, image_url: "/kurti-uploaded-3.png", sort_order: 2, alt_text: "Teal Sharara Ensemble" },
      { id: 9103, product_id: 100, image_url: "/kurti-uploaded-4.png", sort_order: 3, alt_text: "Lavender Pink Floral Kurta" },
      { id: 9104, product_id: 100, image_url: "/kurti-uploaded-5.png", sort_order: 4, alt_text: "Pastel Rose Palazzo Set" }
    ]
  },
  {
    id: 101,
    name: "Meera Ivory Floral Kurta",
    slug: "meera-ivory-floral-kurta",
    description: "Keep it light and elegant. A sleeveless straight kurta printed with delicate pastel vines on handloom cotton.",
    fabric: "100% Handloom Cotton",
    care_instructions: "Hand wash cold. Line dry in shade.",
    category_id: 3,
    category: categories[2],
    base_price: 2400,
    mrp: 3200,
    sku: "MBK-KT-101",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 8,
    tags: ["cotton", "everyday", "ivory", "sleeveless"],
    created_at: "2026-07-30T19:29:59.021Z",
    variants: [
      { id: 9110, product_id: 101, size: "S", color: "Ivory", color_hex: "#FAF6F0", sku: "MBK-KT-101-S", stock_qty: 10 },
      { id: 9111, product_id: 101, size: "M", color: "Ivory", color_hex: "#FAF6F0", sku: "MBK-KT-101-M", stock_qty: 15 }
    ],
    images: [
      { id: 9110, product_id: 101, image_url: "/kurti-uploaded-2.png", sort_order: 0, alt_text: "Meera Ivory Floral Kurta" }
    ]
  },
  {
    id: 102,
    name: "Sitara Teal Sharara Set",
    slug: "sitara-teal-sharara-set",
    description: "A gorgeous heavy border teal blue sharara set with a straight-cut embroidered kurta and sheer organza dupatta.",
    fabric: "Georgette Silk",
    care_instructions: "Dry clean only.",
    category_id: 3,
    category: categories[2],
    base_price: 5800,
    mrp: 6800,
    sku: "MBK-KT-102",
    status: "active",
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 18,
    tags: ["sharara", "teal", "wedding", "embellished"],
    created_at: "2026-07-30T19:29:59.021Z",
    variants: [
      { id: 9120, product_id: 102, size: "S", color: "Teal Blue", color_hex: "#00565B", sku: "MBK-KT-102-S", stock_qty: 8 },
      { id: 9121, product_id: 102, size: "M", color: "Teal Blue", color_hex: "#00565B", sku: "MBK-KT-102-M", stock_qty: 10 }
    ],
    images: [
      { id: 9120, product_id: 102, image_url: "/kurti-uploaded-3.png", sort_order: 0, alt_text: "Sitara Teal Sharara Set" }
    ]
  },
  {
    id: 103,
    name: "Maya Lavender Embroidered Kurta",
    slug: "maya-lavender-embroidered-kurta",
    description: "An elegant lilac-pink A-line flared kurta featuring delicate floral thread embroidery on the sleeves and skirt hem.",
    fabric: "Cotton Linen Blend",
    care_instructions: "Hand wash cold. Iron on reverse.",
    category_id: 3,
    category: categories[2],
    base_price: 3600,
    mrp: 4200,
    sku: "MBK-KT-103",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.7,
    review_count: 11,
    tags: ["linen", "lavender", "summer", "embroidery"],
    created_at: "2026-07-30T19:29:59.021Z",
    variants: [
      { id: 9130, product_id: 103, size: "S", color: "Lavender", color_hex: "#D6C4D6", sku: "MBK-KT-103-S", stock_qty: 12 },
      { id: 9131, product_id: 103, size: "M", color: "Lavender", color_hex: "#D6C4D6", sku: "MBK-KT-103-M", stock_qty: 14 }
    ],
    images: [
      { id: 9130, product_id: 103, image_url: "/kurti-uploaded-4.png", sort_order: 0, alt_text: "Maya Lavender Embroidered Kurta" }
    ]
  },
  {
    id: 104,
    name: "Kavya Pastel Floral Palazzo Set",
    slug: "kavya-pastel-floral-palazzo-set",
    description: "Ethereal pastel peach/rose tones print Kurta with wide-leg palazzo pants and detailed gold laces.",
    fabric: "Premium Georgette",
    care_instructions: "Dry clean recommended.",
    category_id: 3,
    category: categories[2],
    base_price: 4500,
    mrp: 5200,
    sku: "MBK-KT-104",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 7,
    tags: ["georgette", "palazzo", "pastel", "festive"],
    created_at: "2026-07-30T19:29:59.021Z",
    variants: [
      { id: 9140, product_id: 104, size: "S", color: "Rose Pink", color_hex: "#ECC5C8", sku: "MBK-KT-104-S", stock_qty: 6 },
      { id: 9141, product_id: 104, size: "M", color: "Rose Pink", color_hex: "#ECC5C8", sku: "MBK-KT-104-M", stock_qty: 9 }
    ],
    images: [
      { id: 9140, product_id: 104, image_url: "/kurti-uploaded-5.png", sort_order: 0, alt_text: "Kavya Pastel Floral Palazzo Set" }
    ]
  },
  {
    id: 105,
    name: "Anjali Sage Green Kurta",
    slug: "anjali-sage-green-kurta",
    description: "A simple yet elegant sage green front-slit buttoned straight kurta with dark olive palazzo pants featuring beautiful Chikankari bottom details.",
    fabric: "Premium Cotton Silk Blend",
    care_instructions: "Hand wash cold. Line dry in shade.",
    category_id: 3,
    category: categories[2],
    base_price: 3200,
    mrp: 3800,
    sku: "MBK-KT-105",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.8,
    review_count: 5,
    tags: ["cotton-silk", "sage", "chikankari", "casual"],
    created_at: "2026-07-30T19:45:03.175Z",
    variants: [
      { id: 9150, product_id: 105, size: "S", color: "Sage Green", color_hex: "#87A987", sku: "MBK-KT-105-S", stock_qty: 12 },
      { id: 9151, product_id: 105, size: "M", color: "Sage Green", color_hex: "#87A987", sku: "MBK-KT-105-M", stock_qty: 15 }
    ],
    images: [
      { id: 9150, product_id: 105, image_url: "/kurti-uploaded-6.png", sort_order: 0, alt_text: "Anjali Sage Green Kurta" }
    ]
  },
  {
    id: 106,
    name: "Radhika Indigo Printed Kurta Set",
    slug: "radhika-indigo-printed-kurta-set",
    description: "A traditional V-neck long kurta set with matching palazzo and dupatta, decorated in heritage Indigo blue and ivory block prints.",
    fabric: "100% Handloom Cotton",
    care_instructions: "Hand wash separately in cold water with mild detergent.",
    category_id: 3,
    category: categories[2],
    base_price: 3800,
    mrp: 4500,
    sku: "MBK-KT-106",
    status: "active",
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 22,
    tags: ["indigo", "block-print", "heritage", "dupatta"],
    created_at: "2026-07-30T19:45:03.179Z",
    variants: [
      { id: 9160, product_id: 106, size: "S", color: "Indigo Blue", color_hex: "#1A3B8B", sku: "MBK-KT-106-S", stock_qty: 8 },
      { id: 9161, product_id: 106, size: "M", color: "Indigo Blue", color_hex: "#1A3B8B", sku: "MBK-KT-106-M", stock_qty: 12 }
    ],
    images: [
      { id: 9160, product_id: 106, image_url: "/kurti-uploaded-7.png", sort_order: 0, alt_text: "Radhika Indigo Printed Kurta Set" }
    ]
  },
  {
    id: 107,
    name: "Priyanka Hot Pink Bandhani Kurta",
    slug: "priyanka-hot-pink-bandhani-kurta",
    description: "Make a vibrant festive statement in this hot pink block-printed kurta set, complete with detailed neck embroidery and matching striped dupatta.",
    fabric: "Premium Georgette Silk",
    care_instructions: "Dry clean only.",
    category_id: 3,
    category: categories[2],
    base_price: 4900,
    mrp: 5800,
    sku: "MBK-KT-107",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    rating: 4.7,
    review_count: 9,
    tags: ["bandhani", "pink", "festive", "embroidered"],
    created_at: "2026-07-30T19:45:03.179Z",
    variants: [
      { id: 9170, product_id: 107, size: "S", color: "Hot Pink", color_hex: "#FF1493", sku: "MBK-KT-107-S", stock_qty: 10 },
      { id: 9171, product_id: 107, size: "M", color: "Hot Pink", color_hex: "#FF1493", sku: "MBK-KT-107-M", stock_qty: 14 }
    ],
    images: [
      { id: 9170, product_id: 107, image_url: "/kurti-uploaded-8.png", sort_order: 0, alt_text: "Priyanka Hot Pink Bandhani Kurta" }
    ]
  },
  {
    id: 108,
    name: "Kriti Classic Obsidian Kurta",
    slug: "kriti-classic-obsidian-kurta",
    description: "An elegant and minimalist solid black straight kurta featuring subtle gold piping details around the neck and sleeve ends.",
    fabric: "Rayon Slub Blend",
    care_instructions: "Hand wash cold. Iron on low heat.",
    category_id: 3,
    category: categories[2],
    base_price: 2200,
    mrp: 2800,
    sku: "MBK-KT-108",
    status: "active",
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 6,
    tags: ["minimalist", "black", "gold-piping", "slub"],
    created_at: "2026-07-30T19:45:03.179Z",
    variants: [
      { id: 9180, product_id: 108, size: "S", color: "Obsidian Black", color_hex: "#1C1C1C", sku: "MBK-KT-108-S", stock_qty: 15 },
      { id: 9181, product_id: 108, size: "M", color: "Obsidian Black", color_hex: "#1C1C1C", sku: "MBK-KT-108-M", stock_qty: 18 }
    ],
    images: [
      { id: 9180, product_id: 108, image_url: "/kurti-uploaded-9.png", sort_order: 0, alt_text: "Kriti Classic Obsidian Kurta" }
    ]
  },
  {
    id: 109,
    name: "Sadhana Slate Floral Kurta",
    slug: "sadhana-slate-floral-kurta",
    description: "Cool slate grey and floral block prints adorn this classic cotton straight kurta, paired with comfortable white straight pants.",
    fabric: "100% Cotton",
    care_instructions: "Hand wash cold. Line dry in shade.",
    category_id: 3,
    category: categories[2],
    base_price: 2600,
    mrp: 3200,
    sku: "MBK-KT-109",
    status: "active",
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    rating: 4.9,
    review_count: 15,
    tags: ["cotton", "floral", "grey", "straight-fit"],
    created_at: "2026-07-30T19:45:03.179Z",
    variants: [
      { id: 9190, product_id: 109, size: "S", color: "Slate Grey", color_hex: "#708090", sku: "MBK-KT-109-S", stock_qty: 8 },
      { id: 9191, product_id: 109, size: "M", color: "Slate Grey", color_hex: "#708090", sku: "MBK-KT-109-M", stock_qty: 12 }
    ],
    images: [
      { id: 9190, product_id: 109, image_url: "/kurti-uploaded-10.png", sort_order: 0, alt_text: "Sadhana Slate Floral Kurta" }
    ]
  }
];

export const curatedEdits = [
  {
    slug: 'wedding-edit',
    title: 'Wedding Edit',
    subtitle: 'For the bride, the family & forever memories — grand Lehengas & regal ensembles',
    image: '/category-lehengas.jpg',
    product_ids: [151, 152, 153, 154, 155, 156, 157, 158, 159, 160],
  },
  {
    slug: 'festive-edit',
    title: 'Festive Edit',
    subtitle: 'Celebrate every festival with handcrafted brilliance — Bandhani, Zardozi & Silk',
    image: '/hero-slide-sankranti.png',
    product_ids: [153, 156, 158, 160, 100, 101, 102, 103, 107],
  },
  {
    slug: 'everyday-ease',
    title: 'Everyday Ease',
    subtitle: 'Effortless, breathable cotton silhouettes & relaxed daily luxury designed for modern living',
    image: '/category-co-ord-sets.jpg',
    product_ids: [50, 51, 52, 53, 54, 55, 56, 57, 58, 62, 63, 65, 68, 69, 104, 105],
  },
  {
    slug: 'workwear-fusion',
    title: 'Workwear Fusion',
    subtitle: 'From boardroom to evening — structured ethnic shirt-kurtas, linen sets & smart day tunics',
    image: '/hero-slide-casual.png',
    product_ids: [108, 50, 56, 58, 62, 64, 88, 105, 106],
  },
  {
    slug: 'gen-z-edit',
    title: 'Gen-Z Fusion Edit',
    subtitle: 'Youthful fusion trends — denim corsets, asymmetric capes, cut-out maxi dresses & boho vests',
    image: '/category-gen-z-wear.jpg',
    product_ids: [102, 103, 104, 105, 106, 107, 108, 109, 110],
  },
  {
    slug: 'sunset-maxi-edit',
    title: 'Sunset & Resort Maxi Edit',
    subtitle: 'Flowing full-length maxis, floral prints & romantic tiered gowns made for vacations and soirées',
    image: '/category-maxi-dresses.jpg',
    product_ids: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  },
];

// ─── Reviews ────────────────────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    id: 2,
    product_id: 1,
    user_id: 102,
    user_name: 'Priya Sharma',
    rating: 5,
    comment: 'Perfect fit, luxurious fabric, and packaging was beautifully done with a handwritten note. Will definitely order again!',
    status: 'approved',
    created_at: '2024-12-05T09:15:00Z',
  },
];

// ─── Blog Posts ──────────────────────────────────────────────────────────────

export const blogPosts: BlogPost[] = [
  {
    id: 2,
    title: 'How to Style a Saree for a Modern Wedding',
    slug: 'styling-saree-modern-wedding',
    excerpt: 'Timeless draping techniques meet contemporary accessories — our complete guide to wearing a saree at a modern Indian wedding.',
    content: '<p>The saree is one of the most versatile garments in the world. Here is how to make it work at a modern wedding...</p>',
    featured_image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e5?w=1200&q=80',
    author: 'Kritika Sharma',
    tags: ['styling', 'saree', 'wedding', 'tips'],
    published_at: '2025-01-05T10:00:00Z',
    created_at: '2025-01-05T10:00:00Z',
  },
];

// ─── Sample Orders ────────────────────────────────────────────────────────────

export const sampleOrders: Order[] = [
];

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const coupons: Coupon[] = [
  {
    id: 2,
    code: 'FESTIVE500',
    type: 'flat',
    value: 500,
    min_cart_value: 5000,
    usage_limit: undefined,
    usage_count: 147,
    expiry_date: '2025-03-31',
    active: true,
    description: '₹500 off on orders above ₹5,000',
  },
];

// ─── Sample Users ────────────────────────────────────────────────────────────

export const sampleUsers: User[] = [
  {
    id: 101,
    name: 'Ananya Krishnan',
    email: 'ananya@example.com',
    phone: '9876543210',
    role: 'customer',
    created_at: '2024-11-01T10:00:00Z',
    total_orders: 3,
    total_spend: 12800,
  },
  {
    id: 102,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    role: 'customer',
    created_at: '2024-10-15T10:00:00Z',
    total_orders: 5,
    total_spend: 24500,
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────

export const testimonials = [
  {
    id: 1,
    name: 'Swati Sen',
    city: 'Bank More, Dhanbad',
    text: 'Meraki by Kritika in Bank More is hands down the best ethnic boutique in Dhanbad! The atmosphere is so cheerful and welcoming. I got my bridal lehenga custom tailored here and the fit was absolute perfection.',
    rating: 5,
    product: 'Custom Bridal Lehenga',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    source: 'Google Verified Review',
  },
  {
    id: 2,
    name: 'Ritu Singh',
    city: 'Dhanbad',
    text: 'Incredible fabric quality and immaculate finishing! Kritika and her staff are so polite, patient, and knowledgeable. The custom fitting service is top-notch and prices are surprisingly reasonable.',
    rating: 5,
    product: 'Festive Silk Set',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    source: 'Google Verified Review',
  },
  {
    id: 3,
    name: 'Pooja Agarwal',
    city: 'Kolkata',
    text: 'Ordered their Maharani Zardozi Lehenga online after visiting their store. The threadwork details and rose gold embroidery are so rich in person. Fast shipping and beautiful packaging with a handwritten note!',
    rating: 5,
    product: 'Maharani Zardozi Lehenga',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    source: 'Online Purchase',
  },
  {
    id: 4,
    name: 'Ankita Choudhary',
    city: 'Bokaro',
    text: 'Such a lovely collection of Gen-Z fusion co-ords and designer kurtas! The vibe of the store near Libra Hyundai showroom in Bank More is wonderful. Every piece feels unique and handcrafted with love.',
    rating: 5,
    product: 'Gen-Z Denim Fusion Set',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80',
    source: 'Google Verified Review',
  },
  {
    id: 5,
    name: 'Sneha Mukherjee',
    city: 'Dhanbad',
    text: 'I\'ve bought both casual kurtis and festive lehengas from Meraki. The attention to stitching, necklines, and pocket details is unmatched. Kritika really understands what modern Indian women want!',
    rating: 5,
    product: 'Chanderi Kurta Set',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&q=80',
    source: 'Google Verified Review',
  },
  {
    id: 6,
    name: 'Neha Gupta',
    city: 'Patna',
    text: 'Got my Sangeet outfit customized here. The team ensured every alteration was done to my exact measurements. 5/5 stars for hospitality, design, and fabric quality!',
    rating: 5,
    product: 'Emerald Ombre Lehenga',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    source: 'Verified Customer',
  },
  {
    id: 7,
    name: 'Kavita Roy',
    city: 'Ranchi',
    text: 'The Bandhani silk lehenga set I purchased for my sister\'s wedding turned heads all evening! The colors are vibrant and true to the pictures. Meraki is my go-to ethnic label now.',
    rating: 5,
    product: 'Bandhani Heritage Lehenga',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    source: 'Verified Purchase',
  },
  {
    id: 8,
    name: 'Rekha Nair',
    city: 'Ranchi',
    text: 'I wore the Kaveri silk saree to my daughter\'s wedding reception and everyone kept asking where I got it from. Kritika has such a beautiful eye for design and craft.',
    rating: 5,
    product: 'Kaveri Silk Saree',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    source: 'Verified Customer',
  },
];

// ─── Hero Banners ────────────────────────────────────────────────────────────

export const heroBanners = [
  {
    id: 2,
    title: 'Diwali Festive Sale',
    subtitle: 'Celebrate in grandeur with up to 50% off handloom couture.',
    cta_text: 'Shop Festive Sale',
    cta_link: '/collections',
    image: '/hero-slide-diwali.png',
    accent: 'Diwali Exclusive',
  },
  {
    id: 3,
    title: 'Contemporary Gen-Z Fusion Wear',
    subtitle: 'Statement co-ords, boho cape kurtis, and modern silhouettes.',
    cta_text: 'Shop Gen-Z Fusion',
    cta_link: '/collections/gen-z-wear',
    image: '/hero-slide-fusion.png',
    accent: 'Gen-Z Edit',
  },
  {
    id: 1,
    title: 'Festive Lehengas & Royal Grace',
    subtitle: 'Handcrafted Zardozi, Banarasi Brocades & Heritage Kalidar Couture.',
    cta_text: 'Explore Lehengas',
    cta_link: '/collections/lehengas',
    image: '/hero-slide-sankranti.png',
    accent: 'Royal Heritage',
  },
  {
    id: 4,
    title: 'Everyday Linen & Handloom Kurtis',
    subtitle: 'Breathable Chanderi, Chikankari & Block-Printed daily elegance.',
    cta_text: 'Shop Kurtis',
    cta_link: '/collections/kurtis',
    image: '/hero-slide-casual.png',
    accent: 'Everyday Luxe',
  },
  {
    id: 5,
    title: "Collection One / Spring '24",
    subtitle: 'Fresh spring styles, pastel tones, and contemporary cuts.',
    cta_text: "Shop Spring '24",
    cta_link: '/collections',
    image: '/hero-slide-spring.png',
    accent: "Spring '24",
  },
];

// ─── FAQ Data ────────────────────────────────────────────────────────────────

export const faqItems = [
  {
    category: 'Shipping & Delivery',
    questions: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days across India. Express delivery (2–3 days) is available for select pincodes. Bridal and custom pieces may take 7–14 days.' },
      { q: 'Do you offer free shipping?', a: 'Yes! Free shipping on all orders above ₹1,499. Orders below ₹1,499 have a flat shipping fee of ₹99.' },
      { q: 'Do you ship internationally?', a: 'Currently we ship only within India. International shipping is coming soon — sign up to our newsletter to be notified.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for regular items. Sarees, lehengas, and sale items are final sale and cannot be returned.' },
      { q: 'How do I initiate a return?', a: 'Log into your account, go to My Orders, select the item, and click "Request Return". Our team will process your request within 24 hours.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days of us receiving the returned item. The amount is credited to your original payment method.' },
    ],
  },
  {
    category: 'Products & Sizing',
    questions: [
      { q: 'How do I find my size?', a: 'Visit our Size Guide page for detailed measurements. All our products include a size chart in the product description. When in doubt, size up — our kurtas and sets have generous cuts.' },
      { q: 'Are the fabrics authentic?', a: 'Absolutely. We source directly from weaver cooperatives and verified handloom clusters across India — primarily from Madhya Pradesh, Varanasi, and Jharkhand. Every fabric is accompanied by a quality certificate.' },
      { q: 'Can I customize an outfit?', a: 'Yes! We offer made-to-measure customization for select styles. Contact us on WhatsApp with your measurements and the product you love.' },
    ],
  },
  {
    category: 'Payments',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept all major debit/credit cards, UPI, net banking, wallets (Paytm, PhonePe), and Cash on Delivery (COD) for orders up to ₹10,000.' },
      { q: 'Is my payment information secure?', a: 'Yes. Payments are processed via Razorpay — PCI DSS certified. We never store your card details.' },
      { q: 'Can I use a coupon and a gift card together?', a: 'Yes, you can apply one coupon code and one gift card balance at the same checkout.' },
    ],
  },
];

// ─── Admin Dashboard Stats (mock) ────────────────────────────────────────────

export const adminStats = {
  todaySales: 28450,
  totalOrders: 1847,
  pendingOrders: 23,
  lowStockAlerts: 8,
  newCustomers: 14,
  totalRevenue: 2847500,
  salesTrend: [
    { date: '2025-01-13', amount: 18200 },
    { date: '2025-01-14', amount: 24500 },
    { date: '2025-01-15', amount: 19800 },
    { date: '2025-01-16', amount: 32100 },
    { date: '2025-01-17', amount: 28900 },
    { date: '2025-01-18', amount: 41200 },
    { date: '2025-01-19', amount: 28450 },
  ],
  topProducts: [
    { name: 'Zara Fusion Maxi Dress', units: 318, revenue: 763200 },
    { name: 'Kaveri Silk Saree', units: 203, revenue: 2537500 },
    { name: 'Aarohi Floral Kurta Set', units: 126, revenue: 604800 },
    { name: 'Meera Lehenga Choli', units: 87, revenue: 2436000 },
    { name: 'Priya Chanderi Kurta', units: 94, revenue: 263200 },
  ],
};
