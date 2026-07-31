// ─── User Types ────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'staff';

export interface Address {
  id: number;
  user_id: number;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  newsletter_subscribed?: boolean;
  addresses?: Address[];
  total_orders?: number;
  total_spend?: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  token?: string;
}

// ─── Coupon Types ──────────────────────────────────────────────────────────

export interface Coupon {
  id: number;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  min_cart_value?: number;
  usage_limit?: number;
  usage_count: number;
  expiry_date?: string;
  active: boolean;
  applicable_categories?: number[];
  description?: string;
}

// ─── Review Types ──────────────────────────────────────────────────────────

export interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  user_name?: string;
  rating: number;
  comment: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// ─── Gift Card Types ───────────────────────────────────────────────────────

export interface GiftCard {
  id: number;
  code: string;
  initial_balance: number;
  current_balance: number;
  expiry_date?: string;
  issued_to_email?: string;
  status: 'active' | 'used' | 'expired';
}

// ─── Blog Types ────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  published_at: string;
  created_at: string;
}
