const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return money.format(Number(value || 0));
}

export function getApiBase() {
  return localStorage.getItem("fashionStoreApiBase") || "http://localhost:8081/api";
}

export function setApiBase(url) {
  localStorage.setItem("fashionStoreApiBase", url.replace(/\/$/, ""));
}
