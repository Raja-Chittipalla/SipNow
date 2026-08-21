import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";

import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { WHISKY_PRODUCT_TYPES } from "../../utils/categoryGroups.js";

const WHISKY_TYPES = {
  "other-whisky": {
    label: "Other Whisky",
    productType: "other whisky",
  },

  "scotch-whisky": {
    label: "Scotch Whisky",
    productType: "scotch whisky",
  },

  "japanese-whisky": {
    label: "Japanese Whisky",
    productType: "japanese whisky",
  },

  "irish-whisky": {
    label: "Irish Whisky",
    productType: "irish whisky",
  },

  "american-whisky": {
    label: "American Whisky",
    productType: "american whisky",
  },

  "australian-whisky": {
    label: "Australian Whisky",
    productType: "australian whisky",
  },
};

// Full canonical list of whisky types for the sidebar Type filter, so every
// type shows up (even with zero matching products) instead of only the
// ones present in whatever products happen to be loaded.
const WHISKY_TYPE_OPTIONS = Object.values(WHISKY_TYPES).map((whisky) => ({
  key: whisky.productType,
  label: whisky.label,
}));

export default function WhiskyLayout({
  categoryKey: categoryKeyProp,
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const { categoryKey: categoryKeyParam } = useParams();
  const navigate = useNavigate();

  const categoryKey = (categoryKeyProp || categoryKeyParam || "")
    .toLowerCase()
    .trim();

  const whiskyType = WHISKY_TYPES[categoryKey];

  const pageTitle = whiskyType?.label || "Whisky";

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const whiskyProducts = useMemo(() => {
    const allWhisky = products.filter((product) =>
      WHISKY_PRODUCT_TYPES.has(product.type?.toLowerCase().trim())
    );

    // Main Whisky page
    if (!whiskyType) {
      return allWhisky;
    }

    // Selected Whisky category
    return allWhisky.filter(
      (product) => product.type?.toLowerCase().trim() === whiskyType.productType
    );
  }, [products, whiskyType]);

  const pageDescription = whiskyType
    ? `Explore our curated selection of ${pageTitle.toLowerCase()}, handpicked for every occasion.`
    : "Explore our complete selection of whisky, including scotch, Japanese, Irish, American and Australian whisky.";

  // Back to Home
  const handleBack = onBack || (() => navigate("/"));

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description={pageDescription}
        onBack={handleBack}
        tag="WHISKY"
        title={pageTitle}
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage={
            whiskyType
              ? `No ${pageTitle.toLowerCase()} products are available right now.`
              : "New whisky is on the way. Check back soon."
          }
          onAddToCart={handleAddToCart}
          products={whiskyProducts}
          productsLoading={productsLoading}
          typeOptions={WHISKY_TYPE_OPTIONS}
        />
      </Reveal>
    </div>
  );
}
