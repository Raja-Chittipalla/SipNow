import { useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import {
  formatCartQuantity,
  formatCurrency,
  getProductSlug,
  parsePrice,
} from "../utils/productHelpers.js";
import PageHero from "../components/PageHero.jsx";

// Renders one larger, more readable product row inside the cart.
function CartRow({ item, onRemove, onUpdateQuantity }) {
  const { product, quantity, packSize = 1 } = item;
  const productPath = `/product/${getProductSlug(product)}`;

  const pricePerPurchase = parsePrice(product.price) * packSize;
  const lineTotal = pricePerPurchase * quantity;

  return (
    <article className="grid gap-5 border-b border-primary/10 py-6 last:border-0 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:items-center">
      {/* Product Image */}
      <Link
        aria-label={`View ${product.name}`}
        className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-surface-container-high transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-28 sm:w-28"
        to={productPath}
      >
        <img
          alt={product.name}
          className="h-full w-full object-contain p-2"
          src={product.image}
        />
      </Link>

      {/* Product Details */}
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-snug sm:text-xl">
          <Link
            className="transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            to={productPath}
          >
            {product.name}
          </Link>
        </h2>

        {product.category && (
          <Link
            className="mt-1 inline-block text-xs uppercase tracking-wider text-on-surface-variant/80 transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            to={productPath}
          >
            {product.category}
          </Link>
        )}

        {/* Quantity Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Decrease */}
            <button
              aria-label={`Decrease ${product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-transparent text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                onUpdateQuantity(product.name, packSize, quantity - 1)
              }
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                remove
              </span>
            </button>

            {/* Quantity */}
            <span className="min-w-24 text-center text-sm font-semibold text-on-surface">
              {formatCartQuantity(quantity, packSize)}
            </span>

            {/* Increase */}
            <button
              aria-label={`Increase ${product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 bg-transparent text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
              onClick={() =>
                onUpdateQuantity(product.name, packSize, quantity + 1)
              }
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Remove */}
          <button
            className="text-sm text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
            onClick={() => onRemove(product.name, packSize)}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="sm:text-right">
        <p className="text-xs uppercase tracking-wider text-on-surface-variant">
          Item total
        </p>

        <p className="mt-1 font-headline-md text-xl text-primary sm:text-2xl">
          {formatCurrency(lineTotal)}
        </p>

        <p className="mt-1 text-sm text-on-surface-variant">
          {formatCurrency(pricePerPurchase)} per{" "}
          {packSize === 1 ? "individual" : "pack"}
        </p>
      </div>
    </article>
  );
}

export default function Cart({
  cartItems = [],
  isLoggedIn,
  onCheckout,
  onRemove,
  onRequireSignUp,
  onShopAll,
  onUpdateQuantity,
  onBack,
}) {
  /*
   * Scroll to top whenever the cart page is opened.
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  /*
   * Calculate total cart price.
   */
  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      parsePrice(item.product.price) * (item.packSize ?? 1) * item.quantity,
    0
  );

  /*
   * Calculate total number of purchased units.
   */
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  /*
   * Handle checkout.
   */
  const handleCheckout = () => {
    if (isLoggedIn) {
      onCheckout();
    } else {
      onRequireSignUp();
    }
  };

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      {/* Back to Home */}
      <PageHero onBack={onBack} tag="Shopping" />

      <Reveal className="mx-auto max-w-6xl px-margin-mobile md:px-margin-desktop">
        {cartItems.length === 0 ? (
          /* ==================================================
             EMPTY CART
             ================================================== */
          <div className="glass-panel rounded-2xl px-6 py-20 text-center sm:px-10">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant">
              shopping_bag
            </span>

            <h1 className="mt-5 font-headline-md text-2xl uppercase tracking-[0.12em]">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
              Your cart is empty. Time to fill it with something good.
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
          /* ==================================================
             CART WITH ITEMS
             ================================================== */
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
            {/* =================================================
                CART PRODUCTS
                ================================================= */}
            <section className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-primary/10 pb-5">
                <div>
                  <h1 className="font-headline-md text-2xl uppercase tracking-[0.12em] sm:text-3xl">
                    Your cart
                  </h1>

                  <p className="mt-2 text-sm text-on-surface-variant">
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your
                    cart
                  </p>
                </div>

                <span className="text-sm text-on-surface-variant">
                  Review your items before checkout
                </span>
              </div>

              <div>
                {cartItems.map((item) => (
                  <CartRow
                    item={item}
                    key={`${item.product.name}-${item.packSize ?? 1}`}
                    onRemove={onRemove}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>
            </section>

            {/* =================================================
                CART SUMMARY
                ================================================= */}
            <aside className="glass-panel h-fit rounded-2xl p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="font-headline-md text-xl uppercase tracking-[0.12em] sm:text-2xl">
                Cart summary
              </h2>

              <div className="mt-6 space-y-4 border-t border-primary/10 pt-5">
                {/* Items */}
                <div className="flex justify-between gap-4 text-sm text-on-surface-variant">
                  <span>Items ({totalItems})</span>

                  <span>{formatCurrency(total)}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between gap-4 text-sm text-on-surface-variant">
                  <span>Delivery</span>

                  <span>Calculated at checkout</span>
                </div>

                {/* Total */}
                <div className="flex justify-between gap-4 border-t border-primary/10 pt-5">
                  <span className="font-headline-md text-lg">Total</span>

                  <span className="font-headline-md text-2xl text-primary">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout */}
              <button
                className="mt-7 w-full rounded-lg py-4 text-sm uppercase tracking-widest text-white shadow-lg primary-gradient"
                onClick={handleCheckout}
                type="button"
              >
                Proceed to checkout
              </button>

              {/* Continue Shopping */}
              <button
                className="mt-4 w-full text-sm text-on-surface-variant hover:text-primary"
                onClick={onShopAll}
                type="button"
              >
                Continue shopping
              </button>
            </aside>
          </div>
        )}
      </Reveal>
    </div>
  );
}
