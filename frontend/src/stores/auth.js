// Updated auth store — wired to real API
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/apiClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,

      async login({ email, password }) {
        const data = await authApi.login({ email, password });
        set({ user: data.user });
        return data.user;
      },

      async register({ name, email, password, phone }) {
        const data = await authApi.register({ name, email, password, phone });
        set({ user: data.user });
        return data.user;
      },

      async logout() {
        try {
          await authApi.logout();
        } catch (_err) {
          // Ignore network errors on logout
        }
        set({ user: null });
      },

      async updateProfile(patch) {
        const data = await authApi.updateProfile(patch);
        set({ user: data.user });
        return data.user;
      },

      async addAddress(address) {
        const data = await authApi.addAddress(address);
        const user = get().user;
        set({ user: { ...user, addresses: data.addresses } });
        return data.addresses;
      },

      async updateAddress(id, patch) {
        const data = await authApi.updateAddress(id, patch);
        const user = get().user;
        set({ user: { ...user, addresses: data.addresses } });
        return data.addresses;
      },

      async removeAddress(id) {
        const data = await authApi.deleteAddress(id);
        const user = get().user;
        set({ user: { ...user, addresses: data.addresses } });
        return data.addresses;
      },

      setUser(user) { set({ user }); },
    }),
    {
      name: "moro-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
