import { useMemo, useState } from "react";
import { PRICE_RANGES, RATING_OPTIONS } from "../hooks/useFilters.js";
import { CATEGORY_GROUPS } from "../utils/categoryGroups.js";

function buildCountMap(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        className="w-full flex items-center justify-between font-label-md uppercase tracking-[0.15em] text-[11px] text-on-surface-variant"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {title}
        <span className="material-symbols-outlined text-[18px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && children}
    </div>
  );
}

/** Left-hand filter sidebar shared by every product listing page: category, type, price range and stock. */
export default function ProductFilters({
  products,
  selectedCategories,
  onToggleCategory,
  selectedTypes,
  onToggleType,
  priceRanges,
  onTogglePriceRange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  includeOutOfStock,
  onToggleIncludeOutOfStock,
  minRating,
  onToggleMinRating,
  onClearAll,
  resultCount,
  showAllCategories = false,
  showCategoryFilter = true,
  typeOptions = null,
}) {
  const categoryCounts = useMemo(
    () =>
      CATEGORY_GROUPS.map((group) => ({
        key: group.key,
        label: group.label,
        count: products.filter(group.match).length,
      })).filter((group) => showAllCategories || group.count > 0),
    [products, showAllCategories]
  );

  const ratingCounts = useMemo(
    () =>
      RATING_OPTIONS.map((option) => ({
        key: option.key,
        label: option.label,
        count: products.filter((product) => product.rating >= option.key)
          .length,
      })),
    [products]
  );

  const typeList = useMemo(() => {
    const activeGroups = CATEGORY_GROUPS.filter((group) =>
      selectedCategories.includes(group.key)
    );
    const scoped =
      activeGroups.length > 0
        ? products.filter((product) =>
            activeGroups.some((group) => group.match(product))
          )
        : products;
    const counts = buildCountMap(scoped, (product) => product.type);

    // When the page supplies the category's full canonical type list, show
    // every type (even ones with zero matching products right now) instead
    // of only the types that happen to be present in the loaded products.
    // Matched case-insensitively since canonical labels don't always share
    // the exact casing used in the product data.
    if (typeOptions) {
      const countsByLowerKey = new Map();
      for (const [type, count] of counts) {
        countsByLowerKey.set(type.trim().toLowerCase(), { label: type, count });
      }

      const matchedLowerKeys = new Set();
      const canonical = typeOptions.map((option) => {
        const lowerKey = option.key.trim().toLowerCase();
        matchedLowerKeys.add(lowerKey);
        return {
          key: option.key,
          label: option.label,
          count: countsByLowerKey.get(lowerKey)?.count ?? 0,
        };
      });

      // Any type actually present in the data but missing from the
      // canonical list still needs to stay filterable.
      const extras = [...countsByLowerKey.entries()]
        .filter(([lowerKey]) => !matchedLowerKeys.has(lowerKey))
        .map(([, { label, count }]) => ({ key: label, label, count }));

      return [...canonical, ...extras];
    }

    return [...counts.entries()].map(([type, count]) => ({
      key: type,
      label: type,
      count,
    }));
  }, [products, selectedCategories, typeOptions]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTypes.length > 0 ||
    priceRanges.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    includeOutOfStock ||
    minRating !== null;

  return (
    <div className="glass-panel rounded-2xl border border-primary/20 p-6 space-y-6">
      {/* FILTER HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-headline-sm text-lg text-on-surface uppercase">
          <span className="material-symbols-outlined text-[20px]">tune</span>
          Filters
        </h3>

        <button
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
            hasActiveFilters
              ? "border-primary bg-primary/15 text-primary hover:bg-primary/25"
              : "border-primary/10 text-on-surface-variant/40 cursor-not-allowed"
          }`}
          disabled={!hasActiveFilters}
          onClick={onClearAll}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          Clear all
        </button>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-3">
        <p className="font-label-md uppercase tracking-[0.15em] text-[11px] text-on-surface-variant">
          Price Range
        </p>

        <div className="grid grid-cols-2 gap-2">
          {PRICE_RANGES.map((option) => {
            const active = priceRanges.includes(option.key);
            return (
              <button
                className={`rounded-lg border px-3 py-2.5 text-sm text-center transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-primary/20 text-on-surface-variant hover:border-primary/40"
                }`}
                key={option.key}
                onClick={() => onTogglePriceRange(option.key)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label className="flex-1 flex items-center gap-1 rounded-lg border border-primary/20 px-3 py-2 text-sm">
            <span className="text-on-surface-variant">$</span>
            <input
              className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              min="0"
              onChange={(e) =>
                onMinPriceChange(e.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder="Min"
              type="number"
              inputMode="decimal"
              value={minPrice}
            />
          </label>

          <span className="text-on-surface-variant">—</span>

          <label className="flex-1 flex items-center gap-1 rounded-lg border border-primary/20 px-3 py-2 text-sm">
            <span className="text-on-surface-variant">$</span>
            <input
              className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              min="0"
              onChange={(e) =>
                onMaxPriceChange(e.target.value.replace(/[^\d.]/g, ""))
              }
              placeholder="Max"
              type="number"
              inputMode="decimal"
              value={maxPrice}
            />
          </label>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-primary/10" />

      {/* AVAILABILITY */}
      <div className="space-y-3">
        <p className="font-label-md uppercase tracking-[0.15em] text-[11px] text-on-surface-variant">
          Availability
        </p>

        <label className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface cursor-pointer">
          <input
            checked={includeOutOfStock}
            className="w-4 h-4 rounded-sm border border-primary/30 bg-transparent accent-primary cursor-pointer"
            onChange={(e) => onToggleIncludeOutOfStock(e.target.checked)}
            type="checkbox"
          />
          Include out of stock
        </label>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-primary/10" />

      {/* RATING */}
      <CollapsibleSection title="Rating">
        <div className="space-y-1.5">
          {ratingCounts.map(({ key, label, count }) => (
            <label
              className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
              key={key}
            >
              <input
                checked={minRating === key}
                className="w-4 h-4 rounded-sm border border-primary/30 bg-transparent accent-primary cursor-pointer"
                onChange={() => onToggleMinRating(key)}
                type="checkbox"
              />

              <span className="flex-1">{label}</span>

              <span className="text-xs text-on-surface-variant/60">
                {count}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>

      {/* DIVIDER */}
      <div className="h-px bg-primary/10" />

      {/* CATEGORY */}
      {showCategoryFilter && categoryCounts.length > 0 && (
        <>
          <CollapsibleSection title="Category">
            <div className="space-y-1.5">
              {categoryCounts.map(({ key, label, count }) => (
                <label
                  className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
                  key={key}
                >
                  <input
                    checked={selectedCategories.includes(key)}
                    className="w-4 h-4 rounded-sm border border-primary/30 bg-transparent accent-primary cursor-pointer"
                    onChange={() => onToggleCategory(key)}
                    type="checkbox"
                  />

                  <span className="flex-1 font-medium text-on-surface">
                    {label}
                  </span>

                  <span className="text-xs text-on-surface-variant/60">
                    {count}
                  </span>
                </label>
              ))}
            </div>
          </CollapsibleSection>

          <div className="h-px bg-primary/10" />
        </>
      )}

      {/* TYPE */}
      {typeList.length > 0 && (
        <CollapsibleSection title="Type">
          <div className="space-y-1.5">
            {typeList.map(({ key, label, count }) => (
              <label
                className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
                key={key}
              >
                <input
                  checked={selectedTypes.includes(key)}
                  className="w-4 h-4 rounded-sm border border-primary/30 bg-transparent accent-primary cursor-pointer"
                  onChange={() => onToggleType(key)}
                  type="checkbox"
                />

                <span className="flex-1">{label}</span>

                <span className="text-xs text-on-surface-variant/60">
                  {count}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* RESULT COUNT */}
      {typeof resultCount === "number" && (
        <p className="text-xs text-on-surface-variant/70 pt-3 border-t border-primary/10">
          {resultCount} product{resultCount === 1 ? "" : "s"} found
        </p>
      )}
    </div>
  );
}
