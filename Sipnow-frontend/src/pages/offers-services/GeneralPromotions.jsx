import PageHero from "../../components/PageHero.jsx";
import ProductGrid from "../../components/ProductGrid.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";

export default function GeneralPromotions({
  onAddToCart,
  onBack,
  products = [],
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);
  const sectionProducts = products.filter(
    (product) => product.section === "general-promotions"
  );

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      <PageHero
        description="Discover our latest promotions, special offers, and exclusive deals."
        onBack={onBack}
        tag="Offers & Services"
        title="General Promotions"
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <ProductGrid
          addedProduct={addedProduct}
          emptyMessage="New promotions are on the way. Check back soon."
          onAddToCart={handleAddToCart}
          products={sectionProducts}
        />
      </Reveal>
    </div>
  );
}
