export const navLinks = [
  { label: "Shop All", to: "/shop" },
  { label: "Baked Chips", to: "/collections/$slug", params: { slug: "baked-chips" } },
  { label: "Air-Popped", to: "/collections/$slug", params: { slug: "air-popped" } },
  { label: "Millets", to: "/collections/$slug", params: { slug: "millet-snacks" } },
  { label: "Namkeen", to: "/collections/$slug", params: { slug: "namkeen" } },
  { label: "Our Story", to: "/about" },
];

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All snacks", to: "/shop" },
      { label: "Baked chips", to: "/collections/$slug", params: { slug: "baked-chips" } },
      { label: "Air-popped", to: "/collections/$slug", params: { slug: "air-popped" } },
      { label: "Millet snacks", to: "/collections/$slug", params: { slug: "millet-snacks" } },
      { label: "Namkeen", to: "/collections/$slug", params: { slug: "namkeen" } },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Contact us", to: "/contact" },
      { label: "Track an order", to: "/account/orders" },
      { label: "Shipping & returns", to: "/faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My account", to: "/account" },
      { label: "Orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Addresses", to: "/account/addresses" },
    ],
  },
];

export default navLinks;