import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { getSubtype } from "../../utils/productHelpers.js";
import { navMenus } from "../../data/navigation.js";

// Full canonical list of wine varietals for the sidebar Type filter, so
// every type shows up (even with zero matching products) instead of only
// the ones present in whatever products happen to be loaded. Sourced from
// the same navbar mega-menu data as the Wine section links, so it never
// drifts out of sync with what shoppers see there.
const WINE_TYPE_OPTIONS = (
  navMenus.find((menu) => menu.label === "Wine")?.columns ?? []
).flatMap((column) =>
  (column.items || []).map((label) => ({ key: label, label }))
);

const WINE_PLACEHOLDERS = Array.from({ length: 6 }, (_, index) => ({
  id: `wine-placeholder-${index + 1}`,
  name: "Wine Selection",
  brand: "Wine",
  category: "Wine",
  price: 0,
  rating: 0,
  reviews: 0,
  stock: 0,
  image: "",
  isPlaceholder: true,
}));

const WINE_PLACEHOLDER_GRID = (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {WINE_PLACEHOLDERS.map((product) => (
      <div
        key={product.id}
        className="glass-panel rounded-xl overflow-hidden border border-primary/10"
      >
        <div className="h-64 flex items-center justify-center bg-surface-container-high">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
            wine_bar
          </span>
        </div>

        <div className="p-5">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">
            Wine
          </p>

          <h3 className="text-lg font-semibold text-on-surface mb-3">
            Wine Selection
          </h3>

          <div className="h-4 w-24 bg-on-surface/10 rounded mb-4" />

          <div className="h-10 w-full bg-on-surface/10 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Shared layout for the Wine section. The section-root page and every
// dedicated subcategory page (shiraz.jsx, chardonnay.jsx, ...) render this
// with a fixed `wineType`; a bare /wine/:wineType URL still works by
// falling back to the route param.
export default function WineLayout({
  title = "Wine",
  // subtitle = "Explore our curated selection of wines for every occasion.",
  wineType: wineTypeProp,
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const { wineType: wineTypeParam } = useParams();
  const wineType = wineTypeProp || wineTypeParam;

  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate("/"));

  const WINE_DISPLAY_NAMES = {
    ros: "Rosé",
    "sparkling-rose-wine": "Sparkling Rosé Wine",
    "sparkling-ros-wine": "Sparkling Rosé Wine",
    "zero-alcohol-wine": "Zero% Alcohol Wine",
  };

  const winePageTitle = wineType
    ? WINE_DISPLAY_NAMES[wineType.toLowerCase()] ||
      wineType.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : title;

  const winePageDescription = wineType
    ? `Explore our curated selection of ${winePageTitle}, handpicked for every occasion.`
    : "Explore our complete collection of elegant wines, from rich reds and crisp whites to refreshing rosés and sparkling favourites.";

  const wineProducts = useMemo(() => {
    const wineItems = products.filter((product) => {
      const category = String(product.category || "")
        .trim()
        .toLowerCase();

      const categoryGroup = String(product.categoryGroup || "")
        .trim()
        .toLowerCase();

      return category === "wine" || categoryGroup === "wine";
    });

    if (!wineType) {
      return wineItems;
    }

    const searchValue = wineType.replace(/-/g, " ").trim().toLowerCase();

    return wineItems.filter((product) => {
      const name = String(product.name || "")
        .trim()
        .toLowerCase();

      const subcategory = String(
        product.subcategory || product.subCategory || product.wineType || ""
      )
        .trim()
        .toLowerCase();

      const subtype = String(getSubtype(product) || "")
        .trim()
        .toLowerCase();

      return (
        name.includes(searchValue) ||
        subcategory.includes(searchValue) ||
        subtype.includes(searchValue)
      );
    });
  }, [products, wineType]);

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  return (
    <div className="wine-page-transition px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-32 lg:pt-36 pb-16">
      <PageHero
        description={winePageDescription}
        onBack={handleBack}
        tag="Wine"
        title={winePageTitle}
        flush
      />

      <Filters
        addedProduct={addedProduct}
        emptyMessage=""
        onAddToCart={handleAddToCart}
        placeholders={WINE_PLACEHOLDER_GRID}
        products={wineProducts}
        productsLoading={productsLoading}
        typeOptions={WINE_TYPE_OPTIONS}
      />
    </div>
  );
}
