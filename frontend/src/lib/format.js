export const inr = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const orderNo = (n) => `OOR-${String(n).padStart(5, "0")}`;

export const pctOff = (price, mrp) =>
  mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;