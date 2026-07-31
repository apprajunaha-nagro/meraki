// ─── Product Types ──────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string;
  description: string;
  product_count?: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  color: string;
  color_hex?: string;
  sku: string;
  stock_qty: number;
  price_override?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
  alt_text: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  fabric: string;
  care_instructions: string;
  category_id: number;
  category?: Category;
  base_price: number;
  mrp: number;
  sku: string;
  status: 'active' | 'draft' | 'archived';
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
  rating?: number;
  review_count?: number;
  tags?: string[];
}

export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductBadge = 'new' | 'bestseller' | 'sale' | 'sold-out' | 'low-stock';

export interface ProductFilters {
  category?: string;
  sizes?: string[];
  colors?: string[];
  fabrics?: string[];
  priceMin?: number;
  priceMax?: number;
  occasions?: string[];
  availability?: 'in-stock' | 'pre-order' | 'all';
  discount?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popularity' | 'discount';
}
