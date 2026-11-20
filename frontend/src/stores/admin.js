import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { orders } from "@/data/orders";
import { coupons } from "@/data/coupons";
import { reviews } from "@/data/reviews";
import { customers } from "@/data/customers";
import { slugify } from "@/lib/format";

const plainCategories = categories.map(({ icon, ...rest }) => ({ ...rest, products: 0 }));

const defaultSettings = {
  storeName: "MORO",
  supportEmail: "hello@moro.in",
  freeShipping: 499,
  flatShipping: 59,
  lowStock: 15,
  codEnabled: true,
  storeOpen: true,
};

// Admin works on its own copy of the mock catalogue so storefront data stays stable.
export const useAdminStore = create(
  persist(
    (set, get) => ({
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: p.price,
        mrp: p.mrp,
        stock: p.variants?.[0]?.stock ?? 0,
        weight: p.weight,
        image: p.image,
        status: p.variants?.[0]?.stock > 0 ? "active" : "sold-out",
      })),
      categories: plainCategories,
      orders: orders.map((o) => ({ ...o })),
      coupons: coupons.map((c) => ({ ...c })),
      reviews: reviews.map((r) => ({ ...r })),
      customers: customers.map((c) => ({ ...c })),
      settings: defaultSettings,

      addProduct(data) {
        const product = {
          ...data,
          id: `p-${Date.now()}`,
          slug: data.slug || slugify(data.name),
          stock: Number(data.stock) || 0,
        };
        set({ products: [product, ...get().products] });
        return product;
      },
      updateProduct(id, patch) {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...patch, slug: patch.slug || slugify(patch.name || p.name) } : p
          ),
        });
      },
      deleteProduct(id) {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      updateStock(id, stock) {
        const value = Math.max(0, Number(stock) || 0);
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, stock: value, status: value > 0 ? "active" : "sold-out" } : p
          ),
        });
      },

      addCategory(name, description = "") {
        const category = { slug: slugify(name), name, description, tone: "forest", products: 0 };
        set({ categories: [...get().categories, category] });
      },
      deleteCategory(slug) {
        set({ categories: get().categories.filter((c) => c.slug !== slug) });
      },

      updateOrderStatus(id, status) {
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) });
      },
      addOrder(order) {
        set({ orders: [order, ...get().orders] });
        return order;
      },

      addCoupon(coupon) {
        set({ coupons: [{ ...coupon, code: coupon.code.toUpperCase() }, ...get().coupons] });
      },
      toggleCoupon(code) {
        set({
          coupons: get().coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)),
        });
      },
      deleteCoupon(code) {
        set({ coupons: get().coupons.filter((c) => c.code !== code) });
      },

      setReviewStatus(id, status) {
        set({ reviews: get().reviews.map((r) => (r.id === id ? { ...r, status } : r)) });
      },
      deleteReview(id) {
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
      },

      updateSettings(patch) {
        set({ settings: { ...get().settings, ...patch } });
      },
    }),
    { name: "moro-admin" }
  )
);

export default useAdminStore;