import { useEffect } from "react";
import PageHero from "../components/PageHero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Reveal from "../components/Reveal.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";
import { useWishlist } from "../context/useWishlist.js";

export default function Wishlist({ onAddToCart, onBack, onShopAll }) {
  const { wishlistItems, wishlistNotice } = useWishlist();

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="pt-32 pb-24 lg:pt-36">
      <PageHero
        description="Products you've saved for later, all in one place."
        onBack={onBack}
        tag="Saved for later"
        title="Your wishlist"
      />

      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        {wishlistNotice && (
          <div
            className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
            role="status"
          >
            {wishlistNotice}
          </div>
        )}
        {wishlistItems.length === 0 ? (
          <div className="glass-panel rounded-2xl px-6 py-20 text-center sm:px-10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant">
              favorite
            </span>

            <h1 className="mt-5 font-headline-md text-2xl uppercase tracking-[0.12em]">
              Your wishlist is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              Tap the heart on any product to save it here for later.
            </p>

            <button
              className="mt-7 rounded-lg px-8 py-3 text-sm uppercase tracking-widest text-white primary-gradient"
              onClick={onShopAll}
              type="button"
            >
              Shop All Products
            </button>
          </div>
        ) : (
          <ProductGrid
            addedProduct={addedProduct}
            emptyMessage="Your wishlist is empty."
            onAddToCart={handleAddToCart}
            products={wishlistItems}
          />
        )}
      </Reveal>
    </div>
  );
}
