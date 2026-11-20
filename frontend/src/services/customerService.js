import { customers } from "@/data/customers";

export const customerService = {
  list() {
    return customers;
  },
  byEmail(email) {
    return customers.find((c) => c.email === email) || null;
  },
};

export default customerService;