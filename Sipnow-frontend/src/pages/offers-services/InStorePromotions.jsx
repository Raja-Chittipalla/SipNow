import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import ProductGrid from "../../components/ProductGrid.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import { useInStorePromotions } from "../../hooks/useContent.js";
import { getProductSlug } from "../../utils/productHelpers.js";

export default function InStorePromotions({ onAddToCart, onBack }) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);
  const { data: inStorePromotions } = useInStorePromotions();
  const location = useLocation();
  const [highlightedSlug, setHighlightedSlug] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (!inStorePromotions || inStorePromotions.length === 0) return;

    const searchParams = new URLSearchParams(location.search);
    const targetParam =
      location.state?.productSlug ||
      location.state?.selectedProduct ||
      searchParams.get("product");

    if (!targetParam) return;

    const targetSlug = String(targetParam).toLowerCase().trim();

    const matchedProduct = inStorePromotions.find(
      (p) =>
        getProductSlug(p) === targetSlug || p.name.toLowerCase() === targetSlug
    );

    if (matchedProduct) {
      const slug = getProductSlug(matchedProduct);

      const highlightTimer = setTimeout(() => {
        setHighlightedSlug(slug);

        const el = document.getElementById(`product-${slug}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 150);

      const clearTimer = setTimeout(() => {
        setHighlightedSlug(null);
      }, 3500);

      return () => {
        clearTimeout(highlightTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [location, inStorePromotions]);

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description="Exclusive discounts available at your local SipNow store this week. Prices shown apply in-store only and are subject to stock on hand."
        onBack={onBack}
        tag="Offers & Services"
        title="In-Store Promotions"
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <ProductGrid
          addedProduct={addedProduct}
          emptyMessage="New promotions are on the way. Check back soon."
          highlightedSlug={highlightedSlug}
          isInStorePromotion={true}
          onAddToCart={handleAddToCart}
          products={inStorePromotions}
        />
      </Reveal>
    </div>
  );
}
