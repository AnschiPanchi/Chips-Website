import { useEffect, useState } from "react";

// Guards browser-only state (persisted carts, wishlists) from hydration mismatches.
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default useMounted;