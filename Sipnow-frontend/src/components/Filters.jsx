import { useEffect, useRef, useState } from "react";
import { SORT_OPTIONS, useFilters } from "../hooks/useFilters.js";
import ProductFilters from "./ProductFilters.jsx";
import ProductGrid from "./ProductGrid.jsx";

/**
 * Mobile filter toggle, filter sidebar, sort dropdown and result grid —
 * shared by every product listing page (ShopAll, the Offers & Services
 * subpages, and every alcohol category Layout.jsx). Pass the page's
 * already-scoped product list (e.g. only wine, only rum, only gift cards).
 */
export default function Filters({
  products,
  addedProduct,
  onAddToCart,
  emptyMessage,
  productsLoading = false,
  isInStorePromotion = false,
  placeholders = null,
  showAllCategories = false,
  showCategoryFilter = true,
  typeOptions = null,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const containerRef = useRef(null);
  const isFirstRender = useRef(true);
  const {
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
  } = useFilters(products);

  const showPlaceholders = placeholders && filteredProducts.length === 0;

  // Scroll back to the top of the whole filters section (toggle button +
  // sidebar + results) whenever a filter, sort, or search term changes —
  // otherwise a shorter result set can leave the reader stranded below the
  // fold with nothing visible. Anchored to the top of the section rather
  // than just the results column so it doesn't land below a tall mobile
  // filter panel (e.g. ShopAll's full category/type list), which looked
  // like scrolling to the bottom instead of the top. Skipped on first mount
  // so navigating straight to a filtered page doesn't yank the scroll
  // position.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const headerEl = document.querySelector("nav");
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
    const rectTop = el.getBoundingClientRect().top;
    const target = Math.max(
      0,
      window.pageYOffset + rectTop - headerHeight - 16
    );

    window.scrollTo({ top: target, left: 0, behavior: "smooth" });
  }, [
    selectedCategories,
    selectedTypes,
    priceRanges,
    minPrice,
    maxPrice,
    includeOutOfStock,
    minRating,
    sort,
  ]);

  return (
    <div ref={containerRef}>
      <button
        className="lg:hidden w-full flex items-center justify-center gap-2 glass-panel rounded-lg px-4 py-3 mb-6 text-sm font-label-md uppercase tracking-widest border border-primary/20"
        onClick={() => setFiltersOpen((open) => !open)}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">tune</span>
        {filtersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <aside
          className={`lg:w-72 shrink-0 ${filtersOpen ? "block" : "hidden"} lg:block mb-6 lg:mb-0`}
        >
          <div className="lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto scrollbar-hide">
            <ProductFilters
              includeOutOfStock={includeOutOfStock}
              maxPrice={maxPrice}
              minPrice={minPrice}
              minRating={minRating}
              onClearAll={clearAllFilters}
              onMaxPriceChange={setMaxPrice}
              onMinPriceChange={setMinPrice}
              onToggleCategory={toggleCategory}
              onToggleIncludeOutOfStock={setIncludeOutOfStock}
              onToggleMinRating={toggleMinRating}
              onTogglePriceRange={togglePriceRange}
              onToggleType={toggleType}
              priceRanges={priceRanges}
              products={products}
              resultCount={filteredProducts.length}
              selectedCategories={selectedCategories}
              selectedTypes={selectedTypes}
              showAllCategories={showAllCategories}
              showCategoryFilter={showCategoryFilter}
              typeOptions={typeOptions}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-on-surface-variant">
              {productsLoading
                ? "Loading products…"
                : `Showing ${filteredProducts.length} of ${products.length} products`}
            </p>
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              Sort by
              <select
                className="glass-panel rounded-lg pl-3 pr-8 py-1.5 text-sm text-on-surface bg-surface-container-high border border-primary/20 focus:outline-none focus:border-primary"
                onChange={(e) => setSort(e.target.value)}
                value={sort}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {showPlaceholders ? (
            placeholders
          ) : (
            <ProductGrid
              addedProduct={addedProduct}
              emptyMessage={emptyMessage}
              isInStorePromotion={isInStorePromotion}
              onAddToCart={onAddToCart}
              products={filteredProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
}
