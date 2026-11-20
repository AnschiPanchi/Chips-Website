export const coupons = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 499,
    active: true,
    description: "10% off your first order over ₹499",
  },
  {
    code: "CRUNCH50",
    type: "flat",
    value: 50,
    minOrder: 399,
    active: true,
    description: "₹50 off orders over ₹399",
  },
  {
    code: "HOSTEL15",
    type: "percent",
    value: 15,
    minOrder: 799,
    active: true,
    description: "15% off bundle boxes over ₹799",
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    minOrder: 0,
    active: true,
    description: "Free shipping, any order size",
  },
  {
    code: "SUMMER20",
    type: "percent",
    value: 20,
    minOrder: 999,
    active: false,
    description: "Expired seasonal code",
  },
];

export const findCoupon = (code) =>
  coupons.find((c) => c.code === String(code || "").trim().toUpperCase());

export default coupons;