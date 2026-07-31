// ─── Order Types ───────────────────────────────────────────────────────────

import type { Product, ProductVariant } from './product';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod' | 'gift_card' | 'upi' | 'card';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  qty: number;
  price_at_purchase: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface ShippingAddress {
  id?: number;
  label?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id: number;
  user_id?: number;
  guest_email?: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  coupon_code?: string;
  tracking_number?: string;
  courier?: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
  notes?: string;
}

export interface ReturnRequest {
  id: number;
  order_id: number;
  order_item_id: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refund_processed';
  created_at: string;
}
