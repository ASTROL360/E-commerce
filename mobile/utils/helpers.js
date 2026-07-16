export const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export function getProductIdFromCartItem(item) {
  return item.productId || item.product?.id || item.variant?.productId || item.id;
}

export function getItemPrice(item) {
  if (item.lineTotal || item.total) return Number(item.lineTotal || item.total);
  const unitPrice = Number(item.price || item.unitPrice || item.product?.price || item.product?.basePrice || 0);
  return unitPrice * Number(item.quantity || 1);
}

export function getProductPrice(product) {
  return Number(product.price || product.basePrice || product.amount || 0);
}
