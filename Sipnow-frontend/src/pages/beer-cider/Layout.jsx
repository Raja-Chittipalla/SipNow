import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";

import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";

// Slug -> proper display label, so URLs like /beer-cider/ipa or
// /beer-cider/stout-and-porter map back to the exact names shown in the
// navbar mega menu instead of a naive slug-to-words guess.
const SUBCATEGORY_LABELS = {
  pilsner: "Pilsner",
  "dark-lager": "Dark Lager",
  helles: "Helles",
  "pale-ale": "Pale Ale",
  ipa: "IPA",
  "stout-and-porter": "Stout & Porter",
  apple: "Apple",
  pear: "Pear",
  "fruit-cider": "Fruit Cider",
};

// Full canonical list of beer & cider types for the sidebar Type filter, so
// every type shows up (even with zero matching products) instead of only
// the ones present in whatever products happen to be loaded.
const BEER_CIDER_TYPE_OPTIONS = Object.values(SUBCATEGORY_LABELS).map(
  (label) => ({ key: label, label })
);

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Shared layout for the Beer & Cider section. The section-root page and
// every dedicated subcategory page (pilsner.jsx, ipa.jsx, ...) render this
// with a fixed `categoryKey`; a bare /beer-cider/:categoryKey URL still
// works by falling back to the route param.
export default function BeerCiderLayout({
  categoryKey: categoryKeyProp,
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const { categoryKey: categoryKeyParam } = useParams();
  const categoryKey = categoryKeyProp || categoryKeyParam;

  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate("/"));

  const pageTitle = categoryKey
    ? SUBCATEGORY_LABELS[categoryKey] || humanizeSlug(categoryKey)
    : "Beer & Cider";

  const pageDescription = categoryKey
    ? `Explore our curated selection of ${pageTitle.toLowerCase()}, handpicked for every occasion.`
    : "From crisp lagers to hoppy ales and refreshing ciders, explore our full range of beer and cider.";

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const beerCiderProducts = useMemo(() => {
    const items = products.filter((product) => {
      const group = String(product.categoryGroup || "")
        .trim()
        .toLowerCase();
      return group === "beer" || group === "cider";
    });

    if (!categoryKey) {
      return items;
    }

    const searchValue = (
      SUBCATEGORY_LABELS[categoryKey] || humanizeSlug(categoryKey)
    ).toLowerCase();

    return items.filter((product) => {
      const name = String(product.name || "")
        .trim()
        .toLowerCase();
      const type = String(product.type || "")
        .trim()
        .toLowerCase();
      const category = String(product.category || "")
        .trim()
        .toLowerCase();

      return (
        name.includes(searchValue) ||
        type.includes(searchValue) ||
        category.includes(searchValue)
      );
    });
  }, [products, categoryKey]);

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description={pageDescription}
        onBack={handleBack}
        tag="Beer & Cider"
        title={pageTitle}
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage={
            categoryKey
              ? `New ${pageTitle.toLowerCase()} arrivals are on the way. Check back soon.`
              : "New beer & cider arrivals are on the way. Check back soon."
          }
          onAddToCart={handleAddToCart}
          products={beerCiderProducts}
          productsLoading={productsLoading}
          typeOptions={BEER_CIDER_TYPE_OPTIONS}
        />
      </Reveal>
    </div>
  );
}
