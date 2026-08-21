/** Fallback quantity tiers offered in the add-to-cart picker (single unit,
 *  then a case); a product can override with its own `packSizes` array. */
export const DEFAULT_PACK_SIZES = [1, 6];

export function formatPackSize(quantity) {
  return quantity <= 1 ? "Each" : `Pack of ${quantity}`;
}

export function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

export function parsePrice(price) {
  return typeof price === "number"
    ? price
    : Number.parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
}

export function parsePriceParts(price) {
  const priceStr =
    typeof price === "number" ? price.toFixed(2) : String(price ?? "");
  const match = priceStr.match(/\$?(\d+)(?:\.(\d{2}))?/);
  if (match) {
    return {
      dollars: `$${match[1]}`,
      cents: match[2] || "00",
    };
  }
  return { dollars: priceStr, cents: "" };
}

export function getSubtype(product) {
  return product.category?.split("·")[0]?.trim() ?? "";
}

/** Turns a raw key like "zero-alcohol" or "beer" into a display label ("Zero Alcohol", "Beer"). */
export function humanizeLabel(value) {
  return String(value ?? "")
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/** URL-safe slug derived from a product's name, used as its detail-page identifier. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductSlug(product) {
  return slugify(product.name);
}

export function findProductBySlug(products, slug) {
  return products.find((product) => getProductSlug(product) === slug);
}

/** Human label for an add-to-cart quantity tier. */
export function formatPackLabel(quantity) {
  if (quantity <= 1) return "Individual";
  return `Pack of ${quantity}`;
}

/**
 * Reads how many of each pack size are already in the cart for a product, so
 * quantity pickers can open pre-filled with what's actually been added
 * instead of always starting at zero.
 */
export function getCartCounts(cartItems, product, packSizes) {
  return Object.fromEntries(
    packSizes.map((qty) => [
      qty,
      cartItems.find(
        (item) =>
          item.product.name === product.name && (item.packSize ?? 1) === qty
      )?.quantity ?? 0,
    ])
  );
}

/**
 * States exactly how a cart line was purchased rather than only reporting the
 * number of loose units it contains (for example, "1 pack of 6").
 */
export function formatCartQuantity(quantity, packSize = 1) {
  const purchaseCount = Number(quantity) || 0;
  const unitsPerPurchase = Number(packSize) || 1;

  if (unitsPerPurchase <= 1) {
    return `${purchaseCount} ${
      purchaseCount === 1 ? "individual" : "individuals"
    }`;
  }

  return `${purchaseCount} ${
    purchaseCount === 1 ? "pack" : "packs"
  } of ${unitsPerPurchase}`;
}
