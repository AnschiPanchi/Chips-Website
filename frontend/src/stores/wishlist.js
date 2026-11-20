import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle(id) {
        const saved = get().ids.includes(id);
        set({ ids: saved ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !saved;
      },
      has(id) {
        return get().ids.includes(id);
      },
      clear() {
        set({ ids: [] });
      },
    }),
    { name: "moro-wishlist" }
  )
);

export default useWishlistStore;