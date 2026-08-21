import { useEffect, useRef } from "react";
import Reveal from "./Reveal.jsx";
import ProductCard from "./ProductCard.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";

export default function BestSellers({
  onAddToCart,
  onNavigate,
  products = [],
}) {
  const trackRef = useRef(null);
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragMoved = false;

    const onMouseDown = (e) => {
      if (e.target.closest("button")) return;
      isDown = true;
      dragMoved = false;
      dragStartX = e.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("dragging");
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      const delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 3) dragMoved = true;
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
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("mouseleave", endDrag);
    track.addEventListener("click", onClickCapture, { capture: true });

    return () => {
      track.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("mouseleave", endDrag);
      track.removeEventListener("click", onClickCapture, { capture: true });
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
    const targetScroll = Math.min(
      Math.max(track.scrollLeft + direction * amount, 0),
      maxScroll
    );

    track.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const bestSellers = products.slice(0, 15);

  return (
    <Reveal
      className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-28"
      id="best-sellers"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 sm:px-14">
        <div>
          <p className="font-label-md uppercase tracking-[0.28em]">
            Customer Favorites
          </p>

          <h2 className="font-display-lg text-4xl text-on-surface">
            Best Sellers
          </h2>

          <p className="text-on-surface-variant font-body-lg">
            The drinks our customers keep coming back for.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.("best-sellers")}
          className="text-primary font-label-md flex items-center gap-2.5 group border-b border-primary/30 pb-1 shrink-0 whitespace-nowrap cursor-pointer self-start sm:self-auto"
        >
          View All Products
          <span className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </span>
        </button>
      </div>
      <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-3">
        <button
          aria-label="Previous best seller"
          className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/40 bg-background text-on-surface shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => scrollByCard(-1)}
          type="button"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            chevron_left
          </span>
        </button>

        <div
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide select-none"
          id="bestsellers-track"
          ref={trackRef}
        >
          {bestSellers.map((product) => (
            <div
              className="h-[400px] w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-6rem)/5)]"
              key={product.name}
            >
              <ProductCard
                className="h-full w-full [&:not(.is-expanded)>div:first-child]:aspect-auto [&:not(.is-expanded)>div:first-child]:h-[12.75rem] [&.is-expanded>div:first-child]:h-full"
                isAdded={addedProduct === product.name}
                onAdd={handleAddToCart}
                product={product}
              />
            </div>
          ))}
        </div>

        <button
          aria-label="Next best seller"
          className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/40 bg-background text-on-surface shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => scrollByCard(1)}
          type="button"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            chevron_right
          </span>
        </button>
      </div>
    </Reveal>
  );
}
