// Independent client replacement for Base44 SDK

export const base44 = {
  auth: {
    hasToken: () => {
      try {
        return !!localStorage.getItem("oora_auth_token");
      } catch {
        return false;
      }
    },
    me: async () => {
      try {
        const stored = localStorage.getItem("oora_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    },
    login: async (credentials) => {
      const mockUser = {
        id: "usr_1",
        email: credentials?.email || "customer@oora.com",
        name: "Valued Customer",
      };
      localStorage.setItem("oora_auth_token", "demo_token");
      localStorage.setItem("oora_user", JSON.stringify(mockUser));
      return mockUser;
    },
    logout: async () => {
      localStorage.removeItem("oora_auth_token");
      localStorage.removeItem("oora_user");
    },
    register: async (data) => {
      const mockUser = {
        id: "usr_" + Date.now(),
        email: data?.email,
        name: data?.name || "Customer",
      };
      localStorage.setItem("oora_auth_token", "demo_token");
      localStorage.setItem("oora_user", JSON.stringify(mockUser));
      return mockUser;
    },
    resetPassword: async () => true,
    forgotPassword: async () => true,
  },
  entities: {},
};

export default base44;
