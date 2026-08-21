import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Filters from "../../components/Filters.jsx";
import PageHero from "../../components/PageHero.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { isZeroAlcohol } from "../../utils/categoryGroups.js";
import { navMenus } from "../../data/navigation.js";

// Full canonical list of zero % types for the sidebar Type filter, so every
// type shows up (even with zero matching products) instead of only the
// ones present in whatever products happen to be loaded. Sourced from the
// same navbar mega-menu data as the Zero % section links.
const ZERO_ALCOHOL_TYPE_OPTIONS = (
  navMenus.find((menu) => menu.label === "Zero %")?.columns ?? []
).flatMap((column) =>
  (column.items || []).map((label) => ({ key: label, label }))
);

const SUBCATEGORIES = {
  all: {
    title: "Zero % Alcohol",
    keyword: "all",
    subtitle:
      "Explore our complete collection of non-alcoholic wines, beers, spirits, premixes, and ciders.",
    emptyMessage: "No zero % alcohol products found matching your filters.",
  },
  wine: {
    title: "Zero % Alcohol Wine",
    keyword: "wine",
    subtitle: "Explore our collection of zero alcohol wines.",
    emptyMessage: "No zero % alcohol wine products found.",
  },
  beer: {
    title: "Zero % Alcohol Beer",
    keyword: "beer",
    subtitle: "Explore our collection of zero alcohol beers.",
    emptyMessage: "No zero % alcohol beer products found.",
  },
  spirits: {
    title: "Zero % Alcohol Spirits",
    keyword: "spirits",
    subtitle: "Explore our collection of zero alcohol spirits.",
    emptyMessage: "No zero % alcohol spirits products found.",
  },
  premix: {
    title: "Zero % Alcohol Premix",
    keyword: "premix",
    subtitle: "Explore our collection of zero alcohol premix drinks.",
    emptyMessage: "No zero % alcohol premix products found.",
  },
  cider: {
    title: "Zero % Alcohol Cider",
    keyword: "cider",
    subtitle: "Explore our collection of zero alcohol ciders.",
    emptyMessage: "No zero % alcohol cider products found.",
  },
};

function resolveSubcategory(subcategory, pathname) {
  if (subcategory) return subcategory;

  const lastPathPart = pathname.split("/").filter(Boolean).at(-1);
  return lastPathPart === "zero-alcohol" || lastPathPart === "zero"
    ? "all"
    : lastPathPart || "all";
}

function normalizeSubcategory(value) {
  return value
    .toLowerCase()
    .replace(/^zero-alcohol-?/, "")
    .replace(/^zero-?/, "")
    .trim();
}

// Uses the shared listing components; this file only resolves Zero % routes
// and scopes the products before passing them into the global layout.
export default function ZeroAlcoholLayout({
  subcategory: subcategoryProp,
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const { subcategory: subcategoryParam, categoryKey } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate("/"));

  const rawSubcategory = resolveSubcategory(
    subcategoryProp || subcategoryParam || categoryKey,
    pathname
  );
  const subcategory = normalizeSubcategory(rawSubcategory) || "all";
  const config = SUBCATEGORIES[subcategory] || {
    title: `Zero % Alcohol ${subcategory.replace(/\b\w/g, (letter) => letter.toUpperCase())}`,
    keyword: subcategory,
    subtitle: `Explore our collection of zero alcohol ${subcategory}.`,
    emptyMessage: `No zero % alcohol ${subcategory} products found.`,
  };

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const zeroAlcoholProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryGroup = String(product.categoryGroup || "").toLowerCase();
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

      const zeroAlcohol = isZeroAlcohol(product);

      if (!zeroAlcohol || config.keyword === "all") return zeroAlcohol;

      return config.keyword === "spirits"
        ? text.includes("spirit") || categoryGroup === "spirits"
        : text.includes(config.keyword) || categoryGroup === config.keyword;
    });
  }, [products, config.keyword]);

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description={config.subtitle}
        onBack={handleBack}
        tag="Zero %"
        title={config.title}
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage={config.emptyMessage}
          onAddToCart={handleAddToCart}
          products={zeroAlcoholProducts}
          productsLoading={productsLoading}
          typeOptions={ZERO_ALCOHOL_TYPE_OPTIONS}
        />
      </Reveal>
    </div>
  );
}
