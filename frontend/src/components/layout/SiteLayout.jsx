import { Outlet } from "@tanstack/react-router";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-paper">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}