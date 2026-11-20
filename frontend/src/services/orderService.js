import { orders } from "@/data/orders";

export const orderService = {
  list() {
    return orders;
  },
  byCustomer(email) {
    return orders.filter((o) => o.email === email);
  },
  byId(id) {
    return orders.find((o) => o.id === id) || null;
  },
};

export default orderService;