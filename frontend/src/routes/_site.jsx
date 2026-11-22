import { createFileRoute, redirect } from "@tanstack/react-router";
import SiteLayout from "@/components/layout/SiteLayout";
import { authApi } from "@/api/apiClient";

export const Route = createFileRoute("/_site")({
  beforeLoad: ({ location }) => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    // Protected customer routes requiring authentication
    const isProtected = path.startsWith("/account") || path.startsWith("/checkout");

    if (isProtected && !authApi.hasToken()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: SiteLayout,
});
