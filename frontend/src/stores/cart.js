// Updated cart store — validates coupons against real API
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { couponsApi } from "@/api/apiClient";
import { inr } from "@/lib/format";

const lineKey = (productId, weight) => `${productId}__${weight}`;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      add(product, variant, qty = 1) {
        const weight = variant?.weight || product.weight;
        const key = lineKey(product.id, weight);
        const items = [...get().items];
        const existing = items.find((item) => item.key === key);
        if (existing) {
          existing.qty += qty;
        } else {
          items.push({
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            weight,
            price: variant?.price ?? product.price,
            mrp: variant?.mrp ?? product.mrp,
            qty,
          });
        }
        set({ items, isOpen: true });
      },

      remove(key) { set({ items: get().items.filter((item) => item.key !== key) }); },

      setQty(key, qty) {
        set({
          items: get().items.flatMap((item) =>
            item.key === key ? (qty <= 0 ? [] : [{ ...item, qty }]) : [item]
          ),
        });
      },

      clear() { set({ items: [], coupon: null }); },

      async applyCoupon(code) {
        const subtotal = get().subtotal();
        try {
          const { coupon } = await couponsApi.validate(code, subtotal);
          set({ coupon });
          return { ok: true, message: `${coupon.code} applied — ${coupon.description}` };
        } catch (err) {
          return { ok: false, message: err.message || "Invalid coupon." };
        }
      },

      removeCoupon() { set({ coupon: null }); },
      setOpen(isOpen) { set({ isOpen }); },
      subtotal() { return get().items.reduce((sum, item) => sum + item.price * item.qty, 0); },
      count() { return get().items.reduce((sum, item) => sum + item.qty, 0); },
    }),
    {
      name: "moro-cart",
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);

export default useCartStore;
