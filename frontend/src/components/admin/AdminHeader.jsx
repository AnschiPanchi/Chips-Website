import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Store } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";

export default function AdminHeader({ title, subtitle, action }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-forest/10 bg-brand-paper/95 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-brand-forest/15 text-brand-forest lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-heading text-lg font-extrabold tracking-tight text-brand-forest">
              {title}
            </h1>
            {subtitle && <p className="text-[11.5px] text-brand-forest/50">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-brand-cream px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-forest/60 sm:inline-flex">
            Demo session · admin
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-forest/20 px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest hover:border-brand-forest"
          >
            <Store className="h-3.5 w-3.5" /> Store
          </Link>
          {action}
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[80vw] max-w-xs border-0 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}