import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Filters from "../components/Filters.jsx";
import Reveal from "../components/Reveal.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";
import { matchBrands } from "../utils/brandDirectory.js";
import { validateSearchTerm } from "../utils/searchValidation.js";

export default function SearchResults({
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const { valid } = validateSearchTerm(rawQuery);
  const query = valid ? rawQuery.trim() : "";

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const matchedProducts = useMemo(() => {
    const term = query.toLowerCase();
    if (!term) return [];

    return products.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const categoryGroup = product.categoryGroup?.toLowerCase() || "";
      const type = product.type?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const manufacturer = product.manufacturer?.toLowerCase() || "";

      return (
        name.includes(term) ||
        category.includes(term) ||
        categoryGroup.includes(term) ||
        type.includes(term) ||
        brand.includes(term) ||
        manufacturer.includes(term)
      );
    });
  }, [products, query]);

  const brandMatches = useMemo(() => matchBrands(query, 8), [query]);

  return (
    <div className="pt-32 lg:pt-36 pb-20">
      <PageHero
        description={
          query
            ? `${matchedProducts.length} product${
                matchedProducts.length === 1 ? "" : "s"
              } found for "${query}".`
            : "Search our cellar to find what you're after."
        }
        onBack={onBack}
        tag="Search Results"
        title={query ? `Results for "${query}"` : "Search Results"}
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {brandMatches.length > 0 && (
          <div className="mb-8">
            <p className="font-label-md uppercase tracking-[0.15em] text-[11px] text-on-surface-variant mb-3">
              Matching Brands
            </p>
            <div className="flex flex-wrap gap-2">
              {brandMatches.map((brand) => (
                <Link
                  className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary hover:bg-primary/20 transition-colors"
                  key={brand.route}
                  to={brand.route}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Filters
          addedProduct={addedProduct}
          emptyMessage={
            query
              ? `No products match "${query}". Try a different search term.`
              : "Start typing in the search bar to find products."
          }
          onAddToCart={handleAddToCart}
          products={matchedProducts}
          productsLoading={productsLoading}
          showAllCategories
        />
      </Reveal>
    </div>
  );
}
