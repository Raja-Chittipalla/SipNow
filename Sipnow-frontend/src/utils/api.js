const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return res.json();
}

export function resolveImageUrl(image) {
  return image?.startsWith("/") ? `${SERVER_ORIGIN}${image}` : image;
}

export function calculateDiscountedPrice(price, discountType, discountValue) {
  if (discountType === "percentage") {
    return price * (1 - discountValue / 100);
  }
  if (discountType === "fixed") {
    return Math.max(price - discountValue, 0);
  }
  return price;
}

export function formatDiscountBadge(discountType, discountValue) {
  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  }
  if (discountType === "fixed") {
    return `$${discountValue.toFixed(2)} OFF`;
  }
  return "";
}
