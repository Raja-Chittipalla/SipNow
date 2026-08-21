import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { navMenus } from "../../data/navigation.js";

// Full canonical list of premix types for the sidebar Type filter, so every
// type shows up (even with zero matching products) instead of only the
// ones present in whatever products happen to be loaded. Sourced from the
// same navbar mega-menu data as the Premix section links.
const PREMIX_TYPE_OPTIONS = (
  navMenus.find((menu) => menu.label === "Premix")?.columns ?? []
).flatMap((column) =>
  (column.items || []).map((label) => ({ key: label, label }))
);

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// Shared layout for the Premix section. The section-root page and every
// dedicated subcategory page (hard-seltzer.jsx, margarita.jsx, ...) render
// this with a fixed `categoryKey`; a bare /premix/:categoryKey URL still
// works by falling back to the route param.
export default function PremixLayout({
  title,
  subtitle,
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

  const resolvedTitle =
    title || (categoryKey ? humanizeSlug(categoryKey) : "Premix");
  const resolvedCategory = categoryKey || "premix";
  const resolvedSubtitle =
    subtitle ||
    `Explore our range of ${resolvedTitle.toLowerCase()} ready-to-drink favourites.`;

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const premixProducts = useMemo(() => {
    if (!resolvedCategory) {
      return products;
    }

    const searchValue = resolvedCategory.trim().toLowerCase();

    return products.filter((product) => {
      const name = String(product.name || "")
        .trim()
        .toLowerCase();

      const productCategory = String(product.category || "")
        .trim()
        .toLowerCase();

      return (
        name.includes(searchValue) || productCategory.includes(searchValue)
      );
    });
  }, [products, resolvedCategory]);

  return (
    <div className="pt-32 lg:pt-36 pb-20">
      <PageHero
        description={resolvedSubtitle}
        onBack={handleBack}
        tag="Premix"
        title={resolvedTitle}
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage="No products found in this collection."
          onAddToCart={handleAddToCart}
          products={premixProducts}
          productsLoading={productsLoading}
          typeOptions={PREMIX_TYPE_OPTIONS}
        />
      </Reveal>
    </div>
  );
}
