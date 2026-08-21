import { useEffect, useRef } from "react";
import Reveal from "./Reveal.jsx";
import ProductCard from "./ProductCard.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";
import { useInStorePromotions } from "../hooks/useContent.js";

export default function InStorePromotionsPreview({ onAddToCart, onNavigate }) {
  const { data: inStorePromotions = [] } = useInStorePromotions();

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragMoved = false;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;

      isDown = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScroll = track.scrollLeft;

      track.classList.add("dragging");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;

      const delta = e.clientX - dragStartX;

      if (Math.abs(delta) > 3) {
        dragMoved = true;
      }

      track.scrollLeft = dragStartScroll - delta;
    };

    const endDrag = () => {
      if (!isDown) return;

      isDown = false;
      track.classList.remove("dragging");
    };

    const onClickCapture = (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
        dragMoved = false;
      }
    };

    track.addEventListener("mousedown", onMouseDown);
    track.addEventListener("click", onClickCapture, true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mouseleave", endDrag);

    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      track.removeEventListener("click", onClickCapture, true);

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("mouseleave", endDrag);
    };
  }, []);

  const scrollByCard = (direction) => {
    const track = trackRef.current;

    if (!track) return;

    const card = track.querySelector(":scope > div");

    if (!card) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 24;

    const amount = card.offsetWidth + gap;

    const maxScroll = track.scrollWidth - track.clientWidth;

    const currentScroll = track.scrollLeft;

    let targetScroll = currentScroll + direction * amount;

    if (targetScroll < 0) {
      targetScroll = 0;
    }

    if (targetScroll > maxScroll) {
      targetScroll = maxScroll;
    }

    track.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const products = inStorePromotions.slice(0, 15);

  return (
    <Reveal className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <section className="relative w-full overflow-hidden">
        <div>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 sm:px-14">
            <div>
              <p className="font-label-md uppercase tracking-[0.28em]">
                Offers & Services
              </p>

              <h2 className="font-display-lg text-4xl text-on-surface">
                In-Store Promotions
              </h2>

              <p className="text-on-surface-variant font-body-lg">
                Exclusive offers available at your local SipNow store.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("in-store-promotions")}
              className="text-primary font-label-md flex items-center gap-2.5 group border-b border-primary/30 pb-1 shrink-0 whitespace-nowrap cursor-pointer self-start sm:self-auto"
            >
              View All Promotions
              <span className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </span>
            </button>
          </div>

          {/* Product Carousel */}
          <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3">
            {/* Left Arrow */}
            <button
              type="button"
              aria-label="Previous promotion"
              onClick={() => scrollByCard(-1)}
              className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/40 bg-background text-on-surface shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_left
              </span>
            </button>

            {/* Product Track */}
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide select-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.name}
                  className="h-[400px] w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-6rem)/5)]"
                >
                  <ProductCard
                    className="in-store-promotion-card h-full w-full"
                    isAdded={addedProduct === product.name}
                    onAdd={handleAddToCart}
                    product={product}
                    isInStorePromotion={true}
                  />
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              type="button"
              aria-label="Next promotion"
              onClick={() => scrollByCard(1)}
              className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/40 bg-background text-on-surface shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="mt-8">
              <p>New promotions are on the way. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}
