import { brand } from "@/lib/brand";

export function cartTotals({ subtotal = 0, coupon = null, express = false }) {
  let discount = 0;
  if (coupon) {
    if (coupon.type === "percent") discount = Math.round((subtotal * coupon.value) / 100);
    else if (coupon.type === "flat") discount = Math.min(coupon.value, subtotal);
  }
  const freeShip = subtotal - discount >= brand.freeShippingThreshold || coupon?.type === "shipping";
  const base = freeShip ? 0 : brand.shippingFlat;
  const shipping = express ? base + brand.expressShipping : base;
  return { discount, shipping, total: Math.max(0, subtotal - discount + shipping), freeShip };
}