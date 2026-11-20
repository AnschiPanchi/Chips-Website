const styles = {
  placed: "bg-brand-chilli/12 text-brand-chilli",
  packed: "bg-brand-olive/15 text-brand-olive",
  shipped: "bg-brand-forest/10 text-brand-forest",
  "out-for-delivery": "bg-brand-forest text-brand-paper",
  delivered: "bg-brand-olive text-brand-paper",
  cancelled: "bg-brand-ink/10 text-brand-ink/60",
  active: "bg-brand-olive/15 text-brand-olive",
  "sold-out": "bg-brand-ink/10 text-brand-ink/60",
  published: "bg-brand-olive/15 text-brand-olive",
  pending: "bg-brand-chilli/12 text-brand-chilli",
};

export default function StatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
        styles[status] || "bg-brand-forest/8 text-brand-forest/60"
      }`}
    >
      {label || String(status).replace(/-/g, " ")}
    </span>
  );
}