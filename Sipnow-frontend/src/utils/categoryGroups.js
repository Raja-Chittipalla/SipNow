// Whisky is stored as categoryGroup "spirits" with a specific `type`, not its
// own categoryGroup — kept in sync with pages/spirits/Layout.jsx and
// pages/whisky/Layout.jsx, which apply this same split.
export const WHISKY_PRODUCT_TYPES = new Set([
  "other whisky",
  "scotch whisky",
  "japanese whisky",
  "irish whisky",
  "american whisky",
  "australian whisky",
]);

function isWhisky(product) {
  return WHISKY_PRODUCT_TYPES.has(
    String(product.type || "")
      .toLowerCase()
      .trim()
  );
}

// Zero % products aren't tagged with a dedicated categoryGroup either — they're
// identified by keyword, mirroring pages/zero-alcohol/Layout.jsx.
export function isZeroAlcohol(product) {
  const text = [
    product.name,
    product.category,
    product.categoryGroup,
    product.subcategory,
    product.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    text.includes("zero") ||
    text.includes("0%") ||
    text.includes("non-alcoholic") ||
    text.includes("zeroproof")
  );
}

function isPremix(product) {
  const text = [product.name, product.category]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes("premix");
}

function groupOf(product) {
  return String(product.categoryGroup || "")
    .toLowerCase()
    .trim();
}

/**
 * Canonical shop-wide categories (matches the main nav sections). Used by the
 * Shop-All category filter so every real category can be selected even when
 * no product currently falls into it — "Offers" is deliberately excluded
 * since it's a promo bucket, not a beverage category.
 */
export const CATEGORY_GROUPS = [
  { key: "wine", label: "Wine", match: (p) => groupOf(p) === "wine" },
  {
    key: "spirits",
    label: "Spirits",
    match: (p) => groupOf(p) === "spirits" && !isWhisky(p),
  },
  { key: "beer", label: "Beer", match: (p) => groupOf(p) === "beer" },
  { key: "whisky", label: "Whisky", match: isWhisky },
  {
    key: "premix",
    label: "Premix",
    match: (p) => groupOf(p) === "premix" || isPremix(p),
  },
  { key: "zero", label: "Zero %", match: isZeroAlcohol },
];
