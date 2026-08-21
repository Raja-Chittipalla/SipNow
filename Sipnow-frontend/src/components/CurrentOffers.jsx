import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import { useCurrentOffers } from "../hooks/useContent.js";

export default function CurrentOffers({ onNavigate }) {
  const { data: offers } = useCurrentOffers();
  const navigate = useNavigate();

  const handleOfferClick = (targetPage) => {
    if (onNavigate) {
      onNavigate(targetPage);
    } else {
      navigate(targetPage);
    }
  };

  if (!offers || offers.length === 0) return null;

  return (
    <Reveal className="pt-1 pb-5 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="font-label-md text-xs uppercase tracking-[0.28em] text-white">
              EXCLUSIVES & SAVINGS
            </p>
            <h2 className="font-display-lg text-xl md:text-2xl text-on-surface">
              Current Offers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {offers.map((offer) => (
            <article
              key={offer.id}
              onClick={() => handleOfferClick(offer.targetPage)}
              className="group relative min-h-[165px] md:min-h-[180px] overflow-hidden rounded-2xl glass-panel glow-border border border-outline-variant/30 p-4 md:p-4.5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:shadow-xl shadow-lg cursor-pointer"
            >
              {/* Background Image & Overlays */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-surface-container-high">
                <img
                  src={offer.image}
                  alt={offer.title}
                  draggable="false"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-85 brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-black/20"></div>
              </div>

              {/* Top Badge & Validity Tag */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="badge-glow inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-amber-500 px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-black shadow-md">
                  <span className="material-symbols-outlined text-[11px]">
                    local_offer
                  </span>
                  {offer.badge}
                </span>
                {offer.validity && (
                  <span className="text-[9.5px] font-medium text-primary/90 bg-surface-container-high/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-primary/20">
                    {offer.validity}
                  </span>
                )}
              </div>

              {/* Offer Details & CTA */}
              <div className="relative z-10 space-y-1 mt-auto pt-3">
                <h3 className="font-headline-md text-base md:text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {offer.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>{offer.ctaText}</span>
                  <span className="material-symbols-outlined text-[13px]">
                    arrow_forward
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
