import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/types/product';
import type { Coupon } from '@/types/index';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  qty: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  isDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, variant: ProductVariant, qty?: number) => void;
  removeItem: (variantId: number) => void;
  updateQty: (variantId: number, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Computed (as getters)
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const SHIPPING_THRESHOLD = 1499;
const SHIPPING_FEE = 99;
const GST_RATE = 0.05; // 5% GST on clothing

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isDrawerOpen: false,

      addItem: (product, variant, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.variant.id === variant.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variant.id === variant.id
                  ? { ...i, qty: Math.min(i.qty + qty, variant.stock_qty) }
                  : i
              ),
              isDrawerOpen: true,
            };
          }
          return {
            items: [...state.items, { product, variant, qty }],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variant.id !== variantId),
        }));
      },

      updateQty: (variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variant.id === variantId ? { ...i, qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const price = item.variant.price_override ?? item.product.base_price;
          return sum + price * item.qty;
        }, 0);
      },

      getDiscount: () => {
        const { coupon, getSubtotal } = get();
        if (!coupon) return 0;
        const subtotal = getSubtotal();
        if (coupon.min_cart_value && subtotal < coupon.min_cart_value) return 0;
        if (coupon.type === 'percent') {
          return Math.round((subtotal * coupon.value) / 100);
        }
        return Math.min(coupon.value, subtotal);
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const afterDiscount = subtotal - discount;
        return afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.round((subtotal - discount) * GST_RATE);
      },

      getTotal: () => {
        const { getSubtotal, getDiscount, getShipping, getTax } = get();
        return getSubtotal() - getDiscount() + getShipping() + getTax();
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    {
      name: 'meraki-cart',
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
