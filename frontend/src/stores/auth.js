import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoAddress } from "@/data/customers";

// Mock session only — this is a frontend demo, not real authentication.
const demoUser = {
  id: "cust-1",
  name: "Aanya Kapoor",
  email: "aanya.kapoor@example.com",
  phone: "+91 98200 41123",
  role: "customer",
  addresses: [demoAddress],
  isDemo: true,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: demoUser,
      login({ email }) {
        set({ user: { ...demoUser, email, isDemo: false } });
      },
      register({ name, email, phone }) {
        set({ user: { ...demoUser, name, email, phone, isDemo: false } });
      },
      logout() {
        set({ user: null });
      },
      updateProfile(patch) {
        set({ user: { ...get().user, ...patch } });
      },
      addAddress(address) {
        const user = get().user;
        set({
          user: {
            ...user,
            addresses: [...(user.addresses || []), { ...address, id: `addr-${Date.now()}` }],
          },
        });
      },
      updateAddress(id, patch) {
        const user = get().user;
        set({
          user: {
            ...user,
            addresses: (user.addresses || []).map((a) => (a.id === id ? { ...a, ...patch } : a)),
          },
        });
      },
      removeAddress(id) {
        const user = get().user;
        set({ user: { ...user, addresses: (user.addresses || []).filter((a) => a.id !== id) } });
      },
    }),
    { name: "moro-auth" }
  )
);

export default useAuthStore;