import ProductCard from "./ProductCard.jsx";
import { getProductSlug } from "../utils/productHelpers.js";

const GRID_CLASSES =
  "grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(var(--card-min-width),1fr))] gap-3";

/** Product grid with empty state, shared by ShopAll, CategoryPage and InStorePromotions. */
export default function ProductGrid({
  products,
  emptyMessage,
  addedProduct,
  onAddToCart,
  isInStorePromotion = false,
  highlightedSlug,
}) {
  if (products.length === 0) {
    return (
      <p className="text-on-surface-variant text-center py-16">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={GRID_CLASSES}>
      {products.map((product) => {
        const slug = getProductSlug(product);
        return (
          <div
            id={`product-${slug}`}
            key={product.name}
            className="scroll-mt-36 h-full"
          >
            <ProductCard
              isAdded={addedProduct === product.name}
              isInStorePromotion={
                isInStorePromotion || product.isInStorePromotion
              }
              isHighlighted={highlightedSlug === slug}
              onAdd={onAddToCart}
              product={product}
            />
          </div>
        );
      })}
    </div>
  );
}
