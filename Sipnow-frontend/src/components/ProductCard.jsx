import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import {
  useCartItems,
  useCartSelectionUpdater,
} from "../context/useCartItems.js";
import { useWishlist } from "../context/useWishlist.js";
import {
  DEFAULT_PACK_SIZES,
  formatCurrency,
  formatPackLabel,
  formatPackSize,
  getCartCounts,
  getProductSlug,
  parsePrice,
} from "../utils/productHelpers.js";

const SIZE = {
  card: "rounded-xl p-3 space-y-3 h-full flex flex-col",
  imageWrap: "rounded-lg",
  badgePos: "top-2 left-2",
  badgePad: "px-2 py-1",
  badgeIcon: "text-[11px]",
  badgeText: "text-[9px]",
  plainBadgePad: "px-2 py-0.5",
  plainBadgeText: "text-[8px]",
  addBtnPos: "bottom-2.5 right-2.5",
  addBtnSize: "h-9 w-9 hover:w-[128px]",
  addIcon: "text-[14px]",
  category: "text-[12px]",
  name: "text",
  price: "text",
};

/** Single product tile used by BestSellers, ShopAll, CategoryPage and InStorePromotions. */
export default function ProductCard({
  product,
  isAdded,
  onAdd,
  className = "",
  isInStorePromotion = false,
  isHighlighted = false,
}) {
  const s = SIZE;

  const isGlowBadge = product.badgeStyle === "glow";
  const packSizes = product.packSizes ?? DEFAULT_PACK_SIZES;

  const unitPrice = parsePrice(product.price);

  const navigate = useNavigate();

  const cartItems = useCartItems();
  const updateCartSelections = useCartSelectionUpdater();

  const { isWishlisted, toggleWishlist } = useWishlist();

  const wishlisted = isWishlisted(product);

  /*
   * ============================================================
   * QUANTITY PICKER STATE
   * ============================================================
   */

  const pickerStorageKey = `sipnow-open-picker:${getProductSlug(product)}`;

  const [expanded, setExpandedState] = useState(() => {
    try {
      return window.localStorage.getItem(pickerStorageKey) === "1";
    } catch {
      return false;
    }
  });

  /*
   * Controls the floating Add to Cart / Edit Cart
   * button on the normal product card.
   */
  const [showAddButton, setShowAddButton] = useState(true);

  const [counts, setCounts] = useState(() =>
    getCartCounts(cartItems, product, packSizes)
  );

  /*
   * ============================================================
   * EXPANDED PICKER STATE
   * ============================================================
   */

  const setExpanded = (next) => {
    setExpandedState(next);

    try {
      if (next) {
        window.localStorage.setItem(pickerStorageKey, "1");
      } else {
        window.localStorage.removeItem(pickerStorageKey);
      }
    } catch {
      // Ignore storage failures.
    }
  };

  /*
   * ============================================================
   * CART STATE
   * ============================================================
   */

  const cartCounts = getCartCounts(cartItems, product, packSizes);

  const totalUnits = packSizes.reduce((sum, qty) => sum + counts[qty] * qty, 0);

  const subtotal = packSizes.reduce(
    (sum, qty) => sum + counts[qty] * qty * unitPrice,
    0
  );

  const isProductInCart = packSizes.some((qty) => cartCounts[qty] > 0);

  const hasSelectionChanges = packSizes.some(
    (qty) => counts[qty] !== cartCounts[qty]
  );

  /*
   * ============================================================
   * QUANTITY CONTROLS
   * ============================================================
   */

  const updateCount = (qty, delta) => {
    setCounts((current) => ({
      ...current,
      [qty]: Math.max(0, current[qty] + delta),
    }));
  };

  /*
   * ============================================================
   * CLOSE PICKER MANUALLY
   * ============================================================
   */

  const cancelPicker = (e) => {
    e.stopPropagation();

    /*
     * Reset picker quantities to whatever
     * is actually in the cart.
     */
    setCounts(getCartCounts(cartItems, product, packSizes));

    /*
     * Show the floating button again
     * when the user hovers over the card.
     */
    setShowAddButton(true);

    setExpanded(false);
  };

  /*
   * ============================================================
   * SAVE / UPDATE CART
   * ============================================================
   *
   * IMPORTANT:
   * After the selection is successfully sent to the cart,
   * the picker automatically closes.
   * The user does NOT need to press X.
   * ============================================================
   */

  const saveSelection = (e) => {
    e.stopPropagation();

    const selections = packSizes.map((packSize) => ({
      packSize,
      quantity: counts[packSize],
    }));

    /*
     * Nothing changed.
     */
    if (!hasSelectionChanges) {
      return;
    }

    /*
     * Main application cart provider.
     */
    if (updateCartSelections) {
      updateCartSelections(product, selections);

      /*
       * Automatically close the picker
       * immediately after saving.
       */
      setShowAddButton(true);
      setExpanded(false);

      return;
    }

    /*
     * Fallback for isolated ProductCard usage.
     */
    const additions = selections
      .map(({ packSize, quantity }) => ({
        packSize,
        quantity: Math.max(0, quantity - cartCounts[packSize]),
      }))
      .filter(({ quantity }) => quantity > 0);

    if (additions.length > 0 && onAdd) {
      onAdd(product, additions);
    }

    /*
     * Automatically close the picker
     * after fallback save as well.
     */
    setShowAddButton(true);
    setExpanded(false);
  };

  /*
   * ============================================================
   * OPEN QUANTITY PICKER
   * ============================================================
   *
   * This works for both:
   *
   * 1. A new product
   * 2. A product already in the cart
   *
   * When the product is already in the cart,
   * the current cart quantities are loaded.
   */

  const openPicker = (e) => {
    e.stopPropagation();

    /*
     * Always start from the latest cart values.
     */
    setCounts(getCartCounts(cartItems, product, packSizes));

    /*
     * Hide the floating button while
     * the picker is open.
     */
    setShowAddButton(false);

    /*
     * Open picker.
     */
    setExpanded(true);
  };

  /*
   * ============================================================
   * CHECKOUT
   * ============================================================
   */

  const goToCheckout = (e) => {
    e.stopPropagation();
    navigate("/checkout");
  };

  /*
   * ============================================================
   * SELECTION BUTTON LABEL
   * ============================================================
   */

  const selectionButtonLabel =
    totalUnits === 0
      ? isProductInCart
        ? "Remove from cart"
        : "Add to Cart"
      : isProductInCart
        ? "Update cart"
        : "Add to Cart";

  const shouldShowSelectionAction = hasSelectionChanges || !isProductInCart;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      className={`group glass-panel glow-border shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer ${s.card} ${className} ${
        expanded ? "is-expanded" : ""
      } ${
        isHighlighted
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.03] shadow-[0_0_25px_rgba(212,175,55,0.4)] animate-pulse"
          : ""
      }`}
      onClick={() => navigate(`/product/${getProductSlug(product)}`)}
    >
      <div
        className={`relative ${
          expanded
            ? "h-full min-h-[12.75rem] overflow-visible"
            : "aspect-square overflow-hidden"
        } ${s.imageWrap}`}
      >
        {expanded ? (
          /*
           * ======================================================
           * QUANTITY PICKER
           * ======================================================
           */

          <div
            className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-surface-container-high p-3.5 animate-[fadeIn_0.2s_ease-out] h-full justify-between overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product name + close */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-on-surface line-clamp-2 pr-1">
                {product.name}
              </p>

              <button
                aria-label="Close quantity picker"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/15 hover:text-primary transition-colors"
                onClick={cancelPicker}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">
                  close
                </span>
              </button>
            </div>

            {/* Pack size quantities */}
            <div className="space-y-2">
              {packSizes.map((qty) => (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-highest/50 px-2.5 py-2"
                  key={qty}
                >
                  <p className="text-xs font-medium text-on-surface">
                    {formatCurrency(unitPrice * qty)}{" "}
                    <span className="text-on-surface-variant font-normal lowercase">
                      {qty <= 1 ? "each" : formatPackLabel(qty)}
                    </span>
                  </p>

                  <div className="flex items-center gap-2.5">
                    {/* Decrease */}
                    <button
                      aria-label={`Decrease ${formatPackSize(qty)} quantity`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      disabled={counts[qty] === 0}
                      onClick={(e) => {
                        e.stopPropagation();

                        updateCount(qty, -1);
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        remove
                      </span>
                    </button>

                    {/* Quantity */}
                    <span className="w-5 text-center text-sm font-medium text-on-surface">
                      {counts[qty]}
                    </span>

                    {/* Increase */}
                    <button
                      aria-label={`Increase ${formatPackSize(qty)} quantity`}
                      className="flex h-7 w-7 items-center justify-center rounded-full primary-gradient text-white transition-transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();

                        updateCount(qty, 1);
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        add
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal + actions */}
            <div className="space-y-2 border-t border-primary/10 pt-2.5 mt-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Subtotal</span>

                <span className="font-semibold text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Add / Update / Remove */}
              {shouldShowSelectionAction && (
                <button
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg primary-gradient py-2 text-[11px] uppercase tracking-wide text-white shadow-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!hasSelectionChanges}
                  onClick={saveSelection}
                  type="button"
                >
                  {selectionButtonLabel}
                </button>
              )}

              {/* Checkout */}
              {isProductInCart && (
                <button
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 py-2 text-[11px] uppercase tracking-wide text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={hasSelectionChanges}
                  onClick={goToCheckout}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    shopping_bag
                  </span>
                  Go to checkout
                </button>
              )}
            </div>
          </div>
        ) : (
          /*
           * ======================================================
           * NORMAL PRODUCT CARD
           * ======================================================
           */

          <>
            {/* Product image */}
            <div
              className={`absolute inset-0 overflow-hidden bg-surface-container-high ${s.imageWrap}`}
            >
              <img
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-[1s]"
                src={product.image}
              />
            </div>

            {/* ==================================================
                PROMOTION BADGE
                ================================================== */}

            {isInStorePromotion ? (
              product.badgeText && (
                <div className="promo-ribbon">{product.badgeText}</div>
              )
            ) : product.badgeText ? (
              isGlowBadge ? (
                <div
                  className={`badge-glow absolute z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-sm font-bold uppercase tracking-wide shadow-lg ${s.badgePos} ${s.badgePad} ${s.badgeText}`}
                >
                  <span
                    className={`material-symbols-outlined ${s.badgeIcon}`}
                    style={{
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {product.icon}
                  </span>

                  {product.badgeText}
                </div>
              ) : (
                <div
                  className={`absolute z-10 rounded-full bg-primary text-on-primary font-label-sm uppercase tracking-widest ${s.badgePos} ${s.plainBadgePad} ${s.plainBadgeText}`}
                >
                  {product.badgeText}
                </div>
              )
            ) : null}

            {/* ==================================================
                WISHLIST BUTTON
                ================================================== */}

            <button
              aria-label={
                wishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              className={`absolute z-20 top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm shadow-md transition-colors ${
                wishlisted
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
              onClick={(e) => {
                e.stopPropagation();

                toggleWishlist(product);
              }}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={
                  wishlisted
                    ? {
                        fontVariationSettings: '"FILL" 1',
                      }
                    : undefined
                }
              >
                favorite
              </span>
            </button>

            {/* ==================================================
                ADD TO CART / EDIT CART BUTTON
                ==================================================

                IMPORTANT:
                This does NOT depend on isProductInCart.

                Therefore:

                New product:
                  Hover → Add to Cart

                Existing cart product:
                  Hover → Edit Cart

                After clicking:
                  Picker opens

                After Add/Update:
                  Picker closes automatically

                Hover again:
                  Button appears again
            ================================================== */}

            {showAddButton && (
              <button
                aria-label={
                  isProductInCart
                    ? `Edit ${product.name} cart quantity`
                    : `Add ${product.name} to cart`
                }
                className={`group/cart absolute z-20 flex items-center rounded-full primary-gradient text-white shadow-2xl overflow-hidden opacity-100 translate-y-0 md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 ease-out pl-[10px] gap-1.5 ${s.addBtnPos} ${s.addBtnSize}`}
                onClick={openPicker}
                type="button"
              >
                <span
                  className={`material-symbols-outlined shrink-0 ${s.addIcon}`}
                >
                  {isAdded ? "check" : "add_shopping_cart"}
                </span>

                <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide opacity-0 group-hover/cart:opacity-100 transition-opacity duration-200">
                  {isAdded
                    ? "Added!"
                    : isProductInCart
                      ? "Edit Cart"
                      : "Add to Cart"}
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {/* ========================================================
          PRODUCT INFORMATION
          ======================================================== */}

      {!expanded && (
        <div className="flex-1 flex justify-between items-start px-1">
          <div className="space-y-0.5">
            <p
              className={`text-on-surface-variant uppercase tracking-[0.2em] ${s.category}`}
            >
              {product.category}
            </p>

            <h4
              className={`font-headline-md group-hover:text-primary transition-colors ${s.name}`}
            >
              {product.name}
            </h4>

            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            {product.promoLabel && (
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest pt-1">
                {product.promoLabel}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className={`font-headline-md text-primary ${s.price}`}>
              {product.price}
            </p>

            {product.originalPrice && (
              <p className="text-on-surface-variant text-xs line-through">
                {product.originalPrice}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
