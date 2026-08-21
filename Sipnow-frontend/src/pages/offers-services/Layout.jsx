import PageHero from "../../components/PageHero.jsx";
import Filters from "../../components/Filters.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";

// Overview page for /offers. The four Offers & Services subcategories each
// have their own dedicated page — see GeneralPromotions.jsx, GiftCards.jsx,
// Members.jsx and Clearance.jsx. Shop All and In-Store Promotions live
// alongside this file too since they share the nav section but have their
// own data shapes — see ShopAll.jsx and InStorePromotions.jsx.
export default function OffersServices({ onAddToCart, onBack, products = [] }) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  const offerProducts = products.filter(
    (product) => product.categoryGroup === "offers"
  );

  return (
    <>
      <PageHero
        description="Discover promotions, gift cards, member offers and clearance deals across SipNow."
        onBack={onBack}
        tag="Offers & Services"
        title="Offers & Services"
      />

      <Reveal className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Filters
          addedProduct={addedProduct}
          emptyMessage="New offers are on the way. Check back soon."
          onAddToCart={handleAddToCart}
          products={offerProducts}
        />
      </Reveal>
    </>
  );
}
