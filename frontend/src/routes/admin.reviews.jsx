import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import Stars from "@/components/product/Stars";
import StatusBadge from "@/components/account/StatusBadge";
import { shortDate } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const reviews = useAdminStore((s) => s.reviews);
  const setStatus = useAdminStore((s) => s.setReviewStatus);
  const deleteReview = useAdminStore((s) => s.deleteReview);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="pb-16">
      <AdminHeader
        title="Reviews"
        subtitle={`${reviews.filter((r) => r.status === "pending").length} awaiting moderation`}
      />

      <div className="space-y-4 px-5 py-6 lg:px-8">
        <div className="flex gap-2">
          {["all", "published", "pending"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                filter === status
                  ? "bg-brand-forest text-brand-paper"
                  : "border border-brand-forest/15 text-brand-forest/60 hover:border-brand-forest"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((review) => (
            <article key={review.id} className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[12.5px] font-semibold text-brand-forest">{review.name}</p>
                    <StatusBadge status={review.status} />
                  </div>
                  <p className="mt-1 text-[11px] text-brand-forest/45">
                    {review.product} · {shortDate(review.date)}
                  </p>
                </div>
                <Stars value={review.rating} size={12} />
              </div>
              <p className="mt-3 text-[13px] font-medium text-brand-forest">{review.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-brand-forest/65">{review.body}</p>

              <div className="mt-4 flex items-center gap-4">
                {review.status !== "published" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(review.id, "published");
                      toast.success("Review published");
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-olive"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {review.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatus(review.id, "pending");
                      toast.success("Moved back to pending");
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50"
                  >
                    <X className="h-3.5 w-3.5" /> Unpublish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    deleteReview(review.id);
                    toast.success("Review deleted");
                  }}
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-chilli"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-xl border border-dashed border-brand-forest/20 px-5 py-12 text-center text-[12.5px] text-brand-forest/45">
              No reviews in this filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}