import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useMounted } from "@/hooks/useMounted";
import { useAuthStore } from "@/stores/auth";
import { authApi } from "@/api/apiClient";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin console — MORO" }] }),
  beforeLoad: () => {
    const user = useAuthStore.getState().user;
    const hasToken = authApi.hasToken();
    if (!hasToken || !user || user.role !== "admin") {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const mounted = useMounted();

  return (
    <div className="flex min-h-screen bg-brand-cream/30">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-56">
          <AdminSidebar />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        {mounted ? (
          <Outlet />
        ) : (
          <div className="px-8 py-16 text-[13px] text-brand-forest/40">Loading console…</div>
        )}
      </div>
    </div>
  );
}
