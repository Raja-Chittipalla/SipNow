import { useMemo, useState } from "react";
import { parsePrice } from "../utils/productHelpers.js";
import { CATEGORY_GROUPS } from "../utils/categoryGroups.js";

export const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
  { key: "brand-asc", label: "Brand: A to Z" },
  { key: "brand-desc", label: "Brand: Z to A" },
];

export const PRICE_RANGES = [
  { key: "under10", label: "Under $10", min: 0, max: 10 },
  { key: "10to15", label: "$10 – $15", min: 10, max: 15 },
  { key: "15to25", label: "$15 – $25", min: 15, max: 25 },
  { key: "25to50", label: "$25 – $50", min: 25, max: 50 },
  { key: "50to100", label: "$50 – $100", min: 50, max: 100 },
  { key: "over100", label: "$100 & Above", min: 100, max: Infinity },
];

const PRICE_RANGE_BOUNDS = Object.fromEntries(
  PRICE_RANGES.map(({ key, min, max }) => [key, [min, max]])
);

export const RATING_OPTIONS = [
  { key: 4, label: "4 Stars & Up" },
  { key: 3, label: "3 Stars & Up" },
  { key: 2, label: "2 Stars & Up" },
  { key: 1, label: "1 Star & Up" },
];

/**
 * Category (categoryGroup), type, price and stock filtering plus sorting,
 * shared by every product listing page. Pass the page's already-scoped
 * product list (e.g. only wine, only rum, only gift cards) — this only
 * applies the filter/sort on top of that list.
 */
export function useFilters(products) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);
  const [minRating, setMinRating] = useState(null);
  const [sort, setSort] = useState("featured");

  const toggleCategory = (categoryGroup) => {
    setSelectedCategories((current) =>
      current.includes(categoryGroup)
        ? current.filter((item) => item !== categoryGroup)
        : [...current, categoryGroup]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  };

  const togglePriceRange = (key) => {
    setPriceRanges((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
  };

  const toggleMinRating = (key) => {
    setMinRating((current) => (current === key ? null : key));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setPriceRanges([]);
    setMinPrice("");
    setMaxPrice("");
    setIncludeOutOfStock(false);
    setMinRating(null);
  };

  const filteredProducts = useMemo(() => {
    const customMin = minPrice !== "" ? Number(minPrice) : null;
    const customMax = maxPrice !== "" ? Number(maxPrice) : null;
    const hasCustomRange = customMin !== null || customMax !== null;

    const priceBounds = priceRanges.map((key) => PRICE_RANGE_BOUNDS[key]);
    if (hasCustomRange) {
      priceBounds.push([customMin ?? 0, customMax ?? Infinity]);
    }

    const activeCategoryGroups = CATEGORY_GROUPS.filter((group) =>
      selectedCategories.includes(group.key)
    );

    const filtered = products.filter((product) => {
      if (
        activeCategoryGroups.length > 0 &&
        !activeCategoryGroups.some((group) => group.match(product))
      ) {
        return false;
      }

      if (selectedTypes.length > 0) {
        const productType = String(product.type || "")
          .trim()
          .toLowerCase();
        const matchesType = selectedTypes.some(
          (type) => String(type).trim().toLowerCase() === productType
        );
        if (!matchesType) return false;
      }

      if (!includeOutOfStock && product.inStock === false) {
        return false;
      }

      if (minRating !== null && !(product.rating >= minRating)) {
        return false;
      }

      if (priceBounds.length > 0) {
        const price = parsePrice(product.price);
        const withinPrice = priceBounds.some(
          ([min, max]) => price >= min && price <= max
        );
        if (!withinPrice) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sort === "price-asc") {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sort === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sort === "brand-asc") {
      sorted.sort((a, b) =>
        String(a.brand || a.manufacturer || "").localeCompare(
          String(b.brand || b.manufacturer || "")
        )
      );
    } else if (sort === "brand-desc") {
      sorted.sort((a, b) =>
        String(b.brand || b.manufacturer || "").localeCompare(
          String(a.brand || a.manufacturer || "")
        )
      );
    }
    return sorted;
  }, [
    products,
    selectedCategories,
    selectedTypes,
    priceRanges,
    minPrice,
    maxPrice,
    includeOutOfStock,
    minRating,
    sort,
  ]);

  return {
    selectedCategories,
    toggleCategory,
    selectedTypes,
    toggleType,
    priceRanges,
    togglePriceRange,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    includeOutOfStock,
    setIncludeOutOfStock,
    minRating,
    toggleMinRating,
    sort,
    setSort,
    clearAllFilters,
    filteredProducts,
  };
}
