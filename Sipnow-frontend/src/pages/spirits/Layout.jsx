import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";

import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { WHISKY_PRODUCT_TYPES } from "../../utils/categoryGroups.js";

/* =========================================================
   SPIRIT TYPES
========================================================= */

const SPIRIT_TYPES = {
  gin: {
    label: "Gin",
    productType: "gin",
  },

  rum: {
    label: "Rum",
    productType: "rum",
  },

  vodka: {
    label: "Vodka",
    productType: "vodka",
  },

  bourbon: {
    label: "Bourbon",
    productType: "bourbon",
  },

  tequila: {
    label: "Tequila",
    productType: "tequila",
  },

  liqueurs: {
    label: "Liqueurs",
    productType: "liqueurs",
  },

  "brandy-and-cognac": {
    label: "Brandy & Cognac",
    productType: "brandy & cognac",
  },

  "other-spirits": {
    label: "Other Spirits",
    productType: "other spirits",
  },
};

// Full canonical list of spirit types for the sidebar Type filter, so every
// type shows up (even with zero matching products) instead of only the
// ones present in whatever products happen to be loaded.
const SPIRIT_TYPE_OPTIONS = Object.values(SPIRIT_TYPES).map((spirit) => ({
  key: spirit.productType,
  label: spirit.label,
}));

/* =========================================================
   SPIRITS LAYOUT
========================================================= */

export default function SpiritsLayout({
  categoryKey: categoryKeyProp,
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  /* =======================================================
     ROUTE PARAM
  ======================================================= */

  const { categoryKey: categoryKeyParam } = useParams();

  const navigate = useNavigate();

  const categoryKey = (categoryKeyProp || categoryKeyParam || "")
    .toLowerCase()
    .trim();

  /* =======================================================
     BACK BUTTON
  ======================================================= */

  const handleBack = onBack || (() => navigate("/"));

  /* =======================================================
     CURRENT SPIRIT TYPE
  ======================================================= */

  const spiritType = SPIRIT_TYPES[categoryKey];

  const pageTitle = spiritType?.label || "Spirits";

  /* =======================================================
     PAGE DESCRIPTION
  ======================================================= */

  const pageDescription = spiritType
    ? `Explore our curated selection of ${pageTitle.toLowerCase()}, handpicked for every occasion.`
    : "Explore our complete selection of spirits, including gin, rum, vodka, bourbon, tequila, liqueurs, brandy, cognac and more.";

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  /* =======================================================
     GET SPIRIT PRODUCTS
  ======================================================= */

  const spiritProducts = useMemo(() => {
    const allSpirits = products.filter((product) => {
      const categoryGroup = String(product.categoryGroup || "")
        .trim()
        .toLowerCase();

      const type = String(product.type || "")
        .trim()
        .toLowerCase();

      /* Keep only Spirits */
      if (categoryGroup !== "spirits") {
        return false;
      }

      /* Remove Whisky products from Spirits */
      if (WHISKY_PRODUCT_TYPES.has(type)) {
        return false;
      }

      return true;
    });

    /* =====================================================
       /spirits
       Show all spirits
    ===================================================== */

    if (!spiritType) {
      return allSpirits;
    }

    /* =====================================================
       /spirits/gin
       /spirits/rum
       /spirits/vodka
       etc.
    ===================================================== */

    return allSpirits.filter((product) => {
      const productType = String(product.type || "")
        .trim()
        .toLowerCase();

      return productType === spiritType.productType;
    });
  }, [products, spiritType]);

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="pt-32 lg:pt-36 pb-20">
      {/* =================================================
          PAGE HERO
      ================================================= */}

      <PageHero
        description={pageDescription}
        onBack={handleBack}
        tag="Spirits"
        title={pageTitle}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage={
            spiritType
              ? `No ${pageTitle.toLowerCase()} products found in this collection.`
              : "No products found in this collection."
          }
          onAddToCart={handleAddToCart}
          products={spiritProducts}
          productsLoading={productsLoading}
          showCategoryFilter={false}
          typeOptions={SPIRIT_TYPE_OPTIONS}
        />
      </Reveal>
    </div>
  );
}
