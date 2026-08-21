import PageHero from "../components/PageHero.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Reveal from "../components/Reveal.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";

export default function BestSellersPage({
  onAddToCart,
  onBack,
  products = [],
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);
  const bestSellers = products.slice(0, 15);

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description="The drinks our customers keep coming back for."
        onBack={onBack}
        tag="Customer Favorites"
        title="Best Sellers"
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <ProductGrid
          addedProduct={addedProduct}
          emptyMessage="Best sellers are on the way. Check back soon."
          onAddToCart={handleAddToCart}
          products={bestSellers}
        />
      </Reveal>
    </div>
  );
}
