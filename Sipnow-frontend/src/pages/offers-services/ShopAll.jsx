import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";

export default function ShopAll({
  onAddToCart,
  onBack,
  products = [],
  productsLoading = false,
}) {
  const location = useLocation();
  const skipHero = Boolean(location?.state?.skipHero);
  const productsRef = useRef(null);
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  useEffect(() => {
    if (skipHero) {
      // Jump instantly to the products area to avoid showing the hero first.
      // Ensure viewport is at the top first to avoid leftover hero padding
      // affecting the calculated position.
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      const scrollToProducts = () => {
        const el = productsRef.current;
        if (!el) return;
        const rectTop = el.getBoundingClientRect().top;
        const headerEl = document.querySelector("nav");
        const headerHeight = headerEl
          ? headerEl.getBoundingClientRect().height
          : 0;
        const target = Math.max(
          0,
          window.pageYOffset + rectTop - headerHeight - 8
        );
        window.scrollTo({ top: target, left: 0, behavior: "auto" });
      };

      // Attempt immediate scroll, then retry after paint and briefly after.
      scrollToProducts();
      requestAnimationFrame(() => scrollToProducts());
      setTimeout(scrollToProducts, 80);
    }
  }, [skipHero]);

  const containerTopClass = skipHero ? "pt-0" : "pt-32 lg:pt-36";

  return (
    <div className={`${containerTopClass} pb-24`}>
      {!skipHero && (
        <PageHero
          description="Every bottle and can in our cellar, in one place."
          onBack={onBack}
          tag="Full Collection"
          title="All Products"
        />
      )}

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div ref={productsRef}>
          <Filters
            addedProduct={addedProduct}
            emptyMessage="No products match these filters. Try adjusting your selection."
            onAddToCart={handleAddToCart}
            products={products}
            productsLoading={productsLoading}
            showAllCategories
          />
        </div>
      </Reveal>
    </div>
  );
}
