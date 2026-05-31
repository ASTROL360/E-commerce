const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  products: {
    list: "/products",
    detail: (id) => `/products/${id}`,
  },
  cart: {
    list: "/cart",
    add: "/cart",
    remove: (itemId) => `/cart/${itemId}`,
  },
  orders: {
    list: "/orders",
    create: "/orders",
  },
};

export default endpoints;
