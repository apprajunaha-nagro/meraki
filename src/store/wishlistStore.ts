import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

interface WishlistItem {
  product: Product;
  variantId?: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product, variantId?: number) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product, variantId?: number) => void;
  isWishlisted: (productId: number) => boolean;
  clearWishlist: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variantId) => {
        set((state) => {
          if (state.items.some((i) => i.product.id === product.id)) return state;
          return {
            items: [
              ...state.items,
              { product, variantId, addedAt: new Date().toISOString() },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      toggleItem: (product, variantId) => {
        const { isWishlisted, addItem, removeItem } = get();
        if (isWishlisted(product.id)) {
          removeItem(product.id);
        } else {
          addItem(product, variantId);
        }
      },

      isWishlisted: (productId) => {
        return get().items.some((i) => i.product.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getCount: () => get().items.length,
    }),
    {
      name: 'meraki-wishlist',
    }
  )
);
