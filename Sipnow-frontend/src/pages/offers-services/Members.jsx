import { useState } from "react";
import PageHero from "../../components/PageHero.jsx";
import ProductGrid from "../../components/ProductGrid.jsx";
import Reveal from "../../components/Reveal.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";

export default function Members({
  user,
  onAddToCart,
  onBack,
  onRequireSignUp,
  products = [],
}) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  // Filter member products and preserve original-price display
  // for the specific member offer products.
  const sectionProducts = products
    .filter(
      (product) =>
        product.section === "members" || product.categoryGroup === "offers"
    )
    .map((product) => {
      let originalPrice = "";

      if (product.name === "General Promotion Product") {
        originalPrice = "$25.00";
      } else if (product.name === "SipNow Gift Card") {
        originalPrice = "$60.00";
      } else if (product.name === "SipNow Member Special") {
        originalPrice = "$30.00";
      }

      return originalPrice ? { ...product, originalPrice } : product;
    });

  const handleJoinClick = () => {
    if (user) {
      setShowSuccessModal(true);
    } else {
      onRequireSignUp?.();
    }
  };

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      {/* PAGE HERO */}
      <PageHero
        description="Unlock exclusive member-only pricing, free express delivery, rare allocation alerts, and sommelier privileges."
        onBack={onBack}
        tag="Offers & Services"
        title="SipNow Membership"
      />

      {/* MEMBERSHIP STATUS / CTA */}
      {user ? (
        <Reveal className="mx-auto mb-16 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <p className="px-5 py-2 font-display-lg text-2xl text-primary md:text-3xl">
            You are now a SIPNOW Member.
          </p>
        </Reveal>
      ) : (
        <Reveal className="mx-auto mb-16 max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-8 shadow-2xl md:p-12">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Membership Information */}
              <div className="space-y-6 lg:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  <span className="material-symbols-outlined text-[16px]">
                    workspace_premium
                  </span>
                  Join for Free — No Fees Ever
                </div>

                <h2 className="font-display-lg text-3xl leading-tight text-on-surface md:text-5xl">
                  Become a SipNow Member
                </h2>

                <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
                  Experience luxury drinking with curated perks designed for
                  fine wine and spirits enthusiasts. Sign up today and get
                  instant access to member-only prices.
                </p>

                <div className="grid grid-cols-1 gap-4 pt-2 text-sm text-on-surface sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      check_circle
                    </span>

                    <span>Instant Member Discounts on Cellar Staples</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      check_circle
                    </span>

                    <span>Free Express Shipping on Orders $50+</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      check_circle
                    </span>

                    <span>First Priority Alerts on Rare Allocations</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      check_circle
                    </span>

                    <span>Personalized Sommelier Tasting Notes</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <div className="flex flex-col items-center justify-center pt-4 lg:col-span-4 lg:items-end lg:pt-0">
                <button
                  type="button"
                  onClick={handleJoinClick}
                  className="primary-gradient group flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-label-md text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] sm:w-auto"
                >
                  <span>Join for Free to Become a Member</span>

                  <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* MEMBER PRODUCTS GRID */}
      <Reveal className="mx-auto mb-12 max-w-container-max px-margin-mobile md:px-margin-desktop">
        <ProductGrid
          addedProduct={addedProduct}
          emptyMessage="Exclusive member offers are coming soon."
          onAddToCart={handleAddToCart}
          products={sectionProducts}
        />
      </Reveal>

      {/* PERKS CARDS */}
      <Reveal className="mx-auto mb-20 max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* VIP Pricing */}
          <div className="group glass-panel min-h-full space-y-4 rounded-2xl border border-primary/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary transition-colors group-hover:bg-primary/20">
              sell
            </span>

            <h3 className="font-headline-sm text-xl transition-colors group-hover:text-primary">
              VIP Pricing
            </h3>

            <p className="text-sm leading-relaxed text-on-surface-variant">
              Unlock exclusive discounted pricing across our entire range of
              beer, wine, spirits and premixes.
            </p>
          </div>

          {/* Free Delivery */}
          <div className="group glass-panel min-h-full space-y-4 rounded-2xl border border-primary/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary transition-colors group-hover:bg-primary/20">
              local_shipping
            </span>

            <h3 className="font-headline-sm text-xl transition-colors group-hover:text-primary">
              Free Delivery
            </h3>

            <p className="text-sm leading-relaxed text-on-surface-variant">
              Enjoy free insured express delivery straight to your doorstep on
              qualifying orders.
            </p>
          </div>

          {/* Rare Release Access */}
          <div className="group glass-panel min-h-full space-y-4 rounded-2xl border border-primary/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary transition-colors group-hover:bg-primary/20">
              star
            </span>

            <h3 className="font-headline-sm text-xl transition-colors group-hover:text-primary">
              Rare Release Access
            </h3>

            <p className="text-sm leading-relaxed text-on-surface-variant">
              Be first in line when limited-edition whiskies and rare vintage
              wines land in our cellar.
            </p>
          </div>

          {/* Sommelier Service */}
          <div className="group glass-panel min-h-full space-y-4 rounded-2xl border border-primary/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary transition-colors group-hover:bg-primary/20">
              support_agent
            </span>

            <h3 className="font-headline-sm text-xl transition-colors group-hover:text-primary">
              Sommelier Service
            </h3>

            <p className="text-sm leading-relaxed text-on-surface-variant">
              Get personalized food pairings and bottle recommendations from our
              in-house sommeliers.
            </p>
          </div>
        </div>
      </Reveal>

      {/* SUCCESS MODAL FOR SIGNED UP USER */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 animate-[fadeIn_0.2s_ease-out] bg-black/80 backdrop-blur-md"
            onClick={() => setShowSuccessModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md space-y-6 rounded-3xl border border-primary/40 p-8 text-center shadow-2xl glass-panel animate-[scaleUp_0.25s_ease-out] md:p-10">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-4xl">
                workspace_premium
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3 className="font-serif text-3xl text-on-surface">
                You&apos;re a Member Now!
              </h3>

              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Welcome to SipNow VIP Club
              </p>
            </div>

            {/* Message */}
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Hello{" "}
              <strong className="text-on-surface">
                {user?.name || user?.email || "Member"}
              </strong>
              , your VIP membership is officially active! Enjoy exclusive member
              pricing, free delivery perks, and priority rare release alerts.
            </p>

            {/* Close */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="primary-gradient w-full cursor-pointer rounded-full py-3.5 text-sm font-label-md text-white shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]"
            >
              Explore Member Perks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
