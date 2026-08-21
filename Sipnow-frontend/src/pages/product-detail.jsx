import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import StarRating from "../components/StarRating.jsx";
import {
  useCartItems,
  useCartSelectionUpdater,
} from "../context/useCartItems.js";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";
import { useInStorePromotions } from "../hooks/useContent.js";
import {
  DEFAULT_PACK_SIZES,
  findProductBySlug,
  formatCurrency,
  formatPackLabel,
  getCartCounts,
  getProductSlug,
  parsePrice,
} from "../utils/productHelpers.js";

// One subsection within the combined product details box (storage, food, ingredients, ...).
function DetailSection({ icon, title, children }) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-[20px]">
          {icon}
        </span>
        <h3 className="font-headline-sm text-base uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// Individual / pack / case quantity picker. Mounted with `key={product.name}`
// by the parent so its counts reset naturally whenever the viewed product
// changes, instead of syncing that reset through an effect. Counts are
// seeded from — and stay in sync with — the real cart, so the picker keeps
// showing what's already been added even across a page refresh.
function AddToCartPanel({ product, onAdd }) {
  const packSizes = product.packSizes ?? DEFAULT_PACK_SIZES;
  const unitPrice = parsePrice(product.price);
  const cartItems = useCartItems();
  const updateCartSelections = useCartSelectionUpdater();
  const navigate = useNavigate();
  const [counts, setCounts] = useState(() =>
    getCartCounts(cartItems, product, packSizes)
  );

  const updateCount = (qty, delta) => {
    setCounts((current) => ({
      ...current,
      [qty]: Math.max(0, current[qty] + delta),
    }));
  };

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

  // Product detail follows the same exact-quantity rule as every product
  // card, so changing 3 selections to 2 updates instead of adding again.
  const saveSelection = () => {
    const selections = packSizes.map((packSize) => ({
      packSize,
      quantity: counts[packSize],
    }));

    if (!hasSelectionChanges) return;

    if (updateCartSelections) {
      updateCartSelections(product, selections);
      return;
    }

    const additions = selections
      .map(({ packSize, quantity }) => ({
        packSize,
        quantity: Math.max(0, quantity - cartCounts[packSize]),
      }))
      .filter(({ quantity }) => quantity > 0);
    if (additions.length > 0) onAdd(product, additions);
  };

  const selectionButtonLabel =
    totalUnits === 0
      ? isProductInCart
        ? "Remove from cart"
        : "Add to Cart"
      : isProductInCart
        ? "Update cart"
        : "Add to Cart";
  const shouldShowSelectionAction = hasSelectionChanges || !isProductInCart;

  return (
    <div className="glass-panel glow-border rounded-xl p-5 mt-7 space-y-3">
      <p className="font-label-md uppercase tracking-widest text-xs text-on-surface-variant">
        Choose quantity
      </p>

      {packSizes.map((qty) => (
        <div
          className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-highest/50 px-3 py-2.5"
          key={qty}
        >
          <div>
            <p className="text-sm font-medium text-on-surface">
              {formatPackLabel(qty)}
            </p>
            <p className="text-xs text-on-surface-variant">
              {formatCurrency(unitPrice * qty)}{" "}
              {qty > 1 && `(${formatCurrency(unitPrice)} each)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label={`Decrease ${formatPackLabel(qty)} quantity`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
              disabled={counts[qty] === 0}
              onClick={() => updateCount(qty, -1)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                remove
              </span>
            </button>
            <span className="w-5 text-center text-sm font-medium text-on-surface">
              {counts[qty]}
            </span>
            <button
              aria-label={`Increase ${formatPackLabel(qty)} quantity`}
              className="flex h-8 w-8 items-center justify-center rounded-full primary-gradient text-white transition-transform hover:scale-110"
              onClick={() => updateCount(qty, 1)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-primary/10 pt-3">
        <span className="text-sm text-on-surface-variant">Subtotal</span>
        <span className="font-headline-md text-lg text-primary">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {shouldShowSelectionAction && (
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg primary-gradient py-3 text-sm uppercase tracking-widest text-white shadow-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={!hasSelectionChanges}
          onClick={saveSelection}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            add_shopping_cart
          </span>
          {selectionButtonLabel}
        </button>
      )}

      {isProductInCart && (
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/40 py-3 text-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={hasSelectionChanges}
          onClick={() => navigate("/checkout")}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            shopping_bag
          </span>
          Go to checkout
        </button>
      )}
    </div>
  );
}

export default function ProductDetail({ products = [], onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: inStorePromotions = [] } = useInStorePromotions();

  const allProducts = useMemo(() => {
    const promoMap = new Map(
      inStorePromotions.map((promo) => [getProductSlug(promo), promo])
    );

    const mergedProducts = products.map((p) => {
      const slug = getProductSlug(p);
      const promo = promoMap.get(slug);
      if (promo) {
        return {
          ...p,
          ...promo,
          price: promo.price || p.price,
          originalPrice: promo.originalPrice || p.originalPrice || p.price,
        };
      }
      return p;
    });

    for (const promo of inStorePromotions) {
      if (
        !mergedProducts.some((p) => getProductSlug(p) === getProductSlug(promo))
      ) {
        mergedProducts.push(promo);
      }
    }

    return mergedProducts;
  }, [products, inStorePromotions]);

  const product = useMemo(
    () => findProductBySlug(allProducts, slug),
    [allProducts, slug]
  );

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (!product) {
    return (
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-32 lg:pt-36 pb-24 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">
          search_off
        </span>
        <h1 className="font-headline-md text-2xl uppercase tracking-[0.12em] mt-5">
          Product not found
        </h1>
        <p className="text-on-surface-variant mt-3">
          We couldn't find the product you're looking for.
        </p>
        <button
          className="mt-7 rounded-lg px-8 py-3 text-sm uppercase tracking-widest text-white primary-gradient"
          onClick={() => navigate("/shop-all")}
          type="button"
        >
          Shop All Products
        </button>
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.name !== product.name &&
        candidate.categoryGroup === product.categoryGroup
    )
    .slice(0, 4);

  const hasFoodPairing = product.foodPairing?.length > 0;
  const hasIngredients = product.ingredients?.length > 0;

  return (
    <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-32 lg:pt-36 pb-16">
      <button
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
        onClick={() => navigate(-1)}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>
        Back
      </button>

      <Reveal className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Product image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-high glass-panel glow-border">
          <img
            alt={product.name}
            className="w-full h-full object-contain p-8"
            src={product.image}
          />
          {product.badgeText && (
            <div className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-primary to-tertiary text-on-primary font-label-sm font-bold uppercase tracking-wide shadow-lg px-3 py-1.5 text-[10px]">
              {product.badgeText}
            </div>
          )}
        </div>

        {/* Product details */}
        <div>
          <p className="text-on-surface-variant uppercase tracking-[0.2em] text-xs">
            {product.category}
          </p>
          <h1 className="font-display-lg text-3xl sm:text-4xl leading-tight mt-2">
            {product.name}
          </h1>

          <div className="mt-3">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <p className="font-headline-md text-3xl text-primary">
              {product.price}
            </p>
            {product.originalPrice && (
              <p className="text-on-surface-variant line-through">
                {product.originalPrice}
              </p>
            )}
          </div>

          {(product.abv || product.volume) && (
            <div className="flex flex-wrap gap-2 mt-5">
              {product.abv && (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface-container-high px-3 py-1.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    percent
                  </span>
                  {product.abv} ABV
                </span>
              )}
              {product.volume && (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface-container-high px-3 py-1.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    water_drop
                  </span>
                  {product.volume}
                </span>
              )}
            </div>
          )}

          <AddToCartPanel
            key={product.name}
            onAdd={handleAddToCart}
            product={product}
          />
        </div>
      </Reveal>

      {/* Combined product details */}
      <Reveal className="mt-14">
        <div className="glass-panel glow-border rounded-xl p-5 sm:p-6 divide-y divide-outline-variant/20">
          {product.description && (
            <DetailSection icon="notes" title="Description">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </DetailSection>
          )}

          {(product.manufacturer || product.origin) && (
            <DetailSection icon="factory" title="Manufacturer & Origin">
              <dl className="space-y-1.5 text-sm">
                {product.manufacturer && (
                  <div className="flex gap-2">
                    <dt className="text-on-surface-variant shrink-0">
                      Manufacturer:
                    </dt>
                    <dd className="text-on-surface">{product.manufacturer}</dd>
                  </div>
                )}
                {product.origin && (
                  <div className="flex gap-2">
                    <dt className="text-on-surface-variant shrink-0">
                      Origin:
                    </dt>
                    <dd className="text-on-surface">{product.origin}</dd>
                  </div>
                )}
              </dl>
            </DetailSection>
          )}

          {product.storageInstructions && (
            <DetailSection icon="thermostat" title="Storage Instructions">
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {product.storageInstructions}
              </p>
            </DetailSection>
          )}

          {hasFoodPairing && (
            <DetailSection icon="restaurant" title="Food Recommendations">
              <div className="flex flex-wrap gap-2">
                {product.foodPairing.map((item) => (
                  <span
                    className="rounded-full bg-surface-container-highest/60 px-3 py-1 text-xs text-on-surface"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </DetailSection>
          )}

          {hasIngredients && (
            <DetailSection icon="list_alt" title="Ingredients">
              <ul className="text-sm text-on-surface-variant space-y-1">
                {product.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DetailSection>
          )}
        </div>
      </Reveal>

      {relatedProducts.length > 0 && (
        <Reveal className="mt-16">
          <h2 className="font-headline-md text-xl uppercase tracking-[0.12em] mb-6">
            You might also like
          </h2>
          <ProductGrid
            addedProduct={addedProduct}
            onAddToCart={handleAddToCart}
            products={relatedProducts}
          />
        </Reveal>
      )}
    </div>
  );
}
