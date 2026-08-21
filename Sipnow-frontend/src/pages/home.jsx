import HeroCarousel from "../components/HeroCarousel.jsx";
import CurrentOffers from "../components/CurrentOffers.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import InStorePromotionsPreview from "../components/InStorePromotionsPreview.jsx";
import BestSellers from "../components/BestSellers.jsx";
import SommelierCta from "../components/SommelierCta.jsx";
import Newsletter from "../components/Newsletter.jsx";
import WhySipNow from "../components/WhySipNow.jsx";
import ResponsibleDrinking from "../components/ResponsibleDrinking.jsx";

export default function Home({
  onNavigate,
  onAddToCart,
  onStartQuiz,
  products,
}) {
  return (
    <div className="[&>section:not(:first-child)]:!py-12">
      <HeroCarousel />
      <CurrentOffers onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <InStorePromotionsPreview
        onAddToCart={onAddToCart}
        onNavigate={onNavigate}
      />
      <BestSellers
        onAddToCart={onAddToCart}
        onNavigate={onNavigate}
        products={products}
      />
      <SommelierCta onStart={onStartQuiz} />
      <Newsletter />
      <WhySipNow />
      <ResponsibleDrinking />
    </div>
  );
}
