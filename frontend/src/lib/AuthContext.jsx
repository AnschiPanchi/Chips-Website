// Updated AuthContext.jsx — uses real API instead of Base44 mock
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { authApi } from "@/api/apiClient";

export const authQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: async () => {
    if (!authApi.hasToken()) return { user: null, error: null };
    try {
      const { user } = await authApi.me();
      return { user, error: null };
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) return { user: null, error: null };
      throw err;
    }
  },
  staleTime: 5 * 60 * 1000, // 5 min
  retry: false,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data, error, isPending } = useQuery(authQuery);

  const value = useMemo(() => ({
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoadingAuth: isPending,
    authError: data?.error ?? (error ? { type: "unknown", message: error.message } : null),
    refresh: () => queryClient.fetchQuery({ ...authQuery, staleTime: 0 }),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  }), [data, error, isPending, queryClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
