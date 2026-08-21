import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroSlides, useInStorePromotions } from "../hooks/useContent.js";
import { getProductSlug, parsePriceParts } from "../utils/productHelpers.js";

export default function HeroCarousel() {
  const { data: heroSlides } = useHeroSlides();
  const { data: inStorePromotions } = useInStorePromotions();
  const navigate = useNavigate();

  const handlePromotionClick = (product) => {
    const slug = getProductSlug(product);
    navigate(`/in-store-promotions?product=${encodeURIComponent(slug)}`, {
      state: { selectedProduct: product.name, productSlug: slug },
    });
  };
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const autoplayRef = useRef(null);
  const drag = useRef({
    isDragging: false,
    startX: 0,
    prevTranslate: 0,
    currentTranslate: 0,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const setTrackPosition = (withTransition) => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;
    track.classList.toggle("dragging", !withTransition);
    track.style.transform = `translateX(-${indexRef.current * section.offsetWidth}px)`;
  };

  const restartAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(
      () => goToSlide(indexRef.current + 1),
      4000
    );
  };

  const goToSlide = (index) => {
    const next = (index + heroSlides.length) % heroSlides.length;
    indexRef.current = next;
    setCurrentIndex(next);
    setTrackPosition(true);
    restartAutoplay();
  };

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || heroSlides.length === 0) return;

    const dragStart = (e) => {
      drag.current.isDragging = true;
      drag.current.startX = e.touches[0].clientX;
      drag.current.prevTranslate = -indexRef.current * section.offsetWidth;
      track.classList.add("dragging");
      clearInterval(autoplayRef.current);
    };

    const dragMove = (e) => {
      if (!drag.current.isDragging) return;
      const x = e.touches[0].clientX;
      drag.current.currentTranslate =
        drag.current.prevTranslate + (x - drag.current.startX);
      track.style.transform = `translateX(${drag.current.currentTranslate}px)`;
    };

    const dragEnd = () => {
      if (!drag.current.isDragging) return;
      drag.current.isDragging = false;
      track.classList.remove("dragging");
      const movedBy =
        drag.current.currentTranslate - drag.current.prevTranslate;
      let next = indexRef.current;
      if (movedBy < -80 && indexRef.current < heroSlides.length - 1) next++;
      else if (movedBy > 80 && indexRef.current > 0) next--;
      goToSlide(next);
    };

    const handleResize = () => setTrackPosition(true);
    const pauseAutoplay = () => clearInterval(autoplayRef.current);

    track.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("touchmove", dragMove, { passive: true });
    window.addEventListener("touchend", dragEnd);
    window.addEventListener("resize", handleResize);
    section.addEventListener("mouseenter", pauseAutoplay);
    section.addEventListener("mouseleave", restartAutoplay);

    setTrackPosition(true);
    restartAutoplay();

    return () => {
      track.removeEventListener("touchstart", dragStart);
      window.removeEventListener("touchmove", dragMove);
      window.removeEventListener("touchend", dragEnd);
      window.removeEventListener("resize", handleResize);
      section.removeEventListener("mouseenter", pauseAutoplay);
      section.removeEventListener("mouseleave", restartAutoplay);
      clearInterval(autoplayRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlides.length]);

  const scrollToQuiz = () => {
    document
      .getElementById("sommelier-quiz")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="full-bleed-hero relative overflow-hidden"
      id="hero-carousel"
      ref={sectionRef}
    >
      <div className="hero-track flex h-full w-full" ref={trackRef}>
        {heroSlides.map((slide, i) => (
          <div
            className={`hero-slide relative w-full h-full flex items-center overflow-hidden ${
              i === currentIndex ? "is-active" : ""
            }`}
            data-index={i}
            key={slide.card.title}
          >
            <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
              <img
                alt={slide.bgAlt}
                className={
                  slide.imageOnly
                    ? "w-full h-full object-contain object-center pt-20 pb-4 px-4 bg-black"
                    : "w-full h-full object-cover object-center"
                }
                draggable="false"
                src={slide.bgImage}
              />
              {!slide.imageOnly && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </>
              )}
            </div>
            {!slide.imageOnly && (
              <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10 grid lg:grid-cols-2 items-center gap-16">
                {slide.showPromotions ? (
                  <div className="lg:col-span-2 grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-10">
                    <div className="space-y-4 lg:order-1">
                      <p className="font-label-md text-xs uppercase tracking-[0.28em] text-primary">
                        IN-STORE PROMOTIONS
                      </p>
                      <h1 className="font-display-lg text-3xl leading-[1.1] text-white lg:text-4xl">
                        Exclusive Offers &amp;{" "}
                        <span className="italic text-primary">
                          Special Deals
                        </span>
                      </h1>
                      <p className="font-body-lg text-on-surface-variant text-sm leading-relaxed">
                        Discover exclusive in-store offers on selected wines,
                        beers and spirits.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:order-2 lg:gap-8">
                      {inStorePromotions.slice(0, 4).map((product) => {
                        const { dollars, cents } = parsePriceParts(
                          product.price
                        );
                        const nameWords = product.name.split(" ");
                        const brand = nameWords[0]?.toUpperCase();
                        const title =
                          nameWords.slice(1).join(" ") || product.name;

                        return (
                          <article
                            className="group relative flex items-center justify-start gap-3 sm:gap-4 lg:gap-5 p-1 sm:p-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                            key={product.name}
                            onClick={() => handlePromotionClick(product)}
                          >
                            {/* Text Details & Price (positioned right beside bottle image) */}
                            <div className="space-y-0.5 z-10 w-auto min-w-0 shrink-0">
                              <div className="space-y-0">
                                <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow truncate">
                                  {brand}
                                </p>
                                <h4 className="text-xs sm:text-sm font-normal text-white/90 line-clamp-2 leading-tight drop-shadow-sm group-hover:text-primary transition-colors">
                                  {title}
                                </h4>
                              </div>

                              {product.originalPrice && (
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70 pt-0.5">
                                  NON-MEMBER PRICE {product.originalPrice}
                                </p>
                              )}

                              {product.badgeText && (
                                <p className="text-amber-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider pt-0.5">
                                  {product.badgeText}
                                </p>
                              )}

                              <div className="pt-1 flex items-baseline leading-none text-white drop-shadow-lg">
                                <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                                  {dollars}
                                </span>
                                {cents && (
                                  <sup className="text-sm sm:text-base lg:text-lg font-bold align-super ml-0.5 text-white">
                                    {cents}
                                  </sup>
                                )}
                              </div>
                            </div>

                            {/* Clean Transparent Cutout Bottle Image */}
                            <div className="relative shrink-0 flex items-center justify-center h-32 sm:h-40 lg:h-44 w-16 sm:w-20 lg:w-24 z-10">
                              <img
                                alt={product.name}
                                className="h-full w-auto max-w-full object-contain mix-blend-multiply drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)] group-hover:scale-108 transition-transform duration-500"
                                draggable="false"
                                src={product.image}
                              />
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ) : slide.membership ? (
                  <div className="lg:col-span-2 grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-10">
                    <div className="space-y-4 lg:order-1">
                      <p className="font-label-md text-xs uppercase tracking-[0.28em] text-primary">
                        {slide.tag || "MEMBERSHIP PRIVILEGES"}
                      </p>
                      <h1 className="font-display-lg text-3xl leading-[1.1] text-white lg:text-4xl">
                        {slide.titleLines[0]} <br />
                        <span className="italic text-primary">
                          {slide.titleLines[1]}
                        </span>
                      </h1>
                      <p className="font-body-lg text-on-surface-variant text-sm leading-relaxed max-w-md">
                        {slide.description}
                      </p>
                    </div>
                    <div className="lg:order-2 flex items-center justify-center">
                      <div className="w-full max-w-md relative overflow-hidden rounded-3xl glass-panel glow-border border border-primary/30 p-6 shadow-2xl space-y-5 text-center group transition-all duration-500 hover:-translate-y-1">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30 text-primary mx-auto">
                          <span className="material-symbols-outlined text-2xl">
                            card_membership
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <span className="badge-glow inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-amber-500 text-[9px] font-bold uppercase tracking-widest text-black mb-1">
                            MEMBER CLUB ACCESS
                          </span>
                          <h3 className="font-headline-md text-xl font-bold text-white">
                            SipNow Membership
                          </h3>
                          <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                            Unlock exclusive discounts, double rewards points,
                            and member event access.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(slide.targetPage || "/offers/members")
                          }
                          className="w-full primary-gradient py-3.5 px-6 rounded-full font-label-md text-label-md shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center justify-center gap-2 text-white font-semibold cursor-pointer text-xs uppercase tracking-wider"
                        >
                          <span>
                            {slide.primaryCta || "Join / Login to Membership"}
                          </span>
                          <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : slide.quiz ? (
                  <div className="lg:col-span-2 mx-auto max-w-2xl text-center space-y-5 md:space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel border border-primary/40 text-primary">
                      <span className="material-symbols-outlined text-base">
                        auto_awesome
                      </span>
                      <span className="text-label-sm font-label-sm uppercase tracking-widest text-xs">
                        Find Your Perfect Pour
                      </span>
                    </div>
                    <div className="space-y-3">
                      <h1 className="font-display-lg text-display-lg-mobile lg:text-3xl text-white leading-[1.1]">
                        Let Our{" "}
                        <span className="italic text-primary">Sommelier</span>{" "}
                        Guide You.
                      </h1>
                      <p className="font-body-lg text-on-surface-variant text-sm max-w-xl mx-auto leading-relaxed">
                        Answer four simple questions and discover a selection
                        curated for your taste.
                      </p>
                    </div>
                    <button
                      className="primary-gradient px-9 py-3.5 rounded-full font-label-md text-label-md shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
                      onClick={scrollToQuiz}
                      type="button"
                    >
                      Start Your Personal Quiz
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5 md:space-y-7">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel border border-primary/40 text-primary">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                        <span className="text-label-sm font-label-sm uppercase tracking-widest text-xs">
                          {slide.badge}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <h1 className="font-display-lg text-display-lg-mobile lg:text-3xl text-white leading-[1.1]">
                          {slide.titleLines[0]} <br />
                          <span className="italic text-primary">
                            {slide.titleLines[1]}
                          </span>
                        </h1>
                        <p className="font-body-lg text-on-surface-variant text-sm max-w-lg leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <button className="primary-gradient px-9 py-3.5 rounded-full font-label-md text-label-md shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                          {slide.primaryCta}
                        </button>
                        <button className="glass-panel border border-outline-variant/30 px-8 py-3.5 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                          {slide.secondaryCta}
                        </button>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="relative group max-w-[290px] lg:max-w-[320px] mx-auto">
                        <div className="absolute -inset-10 bg-primary/20 blur-[80px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative glass-panel rounded-3xl p-3.5 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transform rotate-2 group-hover:rotate-0 transition-transform duration-700">
                          <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                            <img
                              className="w-full h-full object-cover"
                              draggable="false"
                              src={slide.card.image}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">
                                {slide.card.tag}
                              </p>
                              <h3 className="font-headline-sm text-white text-lg">
                                {slide.card.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        aria-label="Previous hero slide"
        className="hidden md:flex absolute left-3 lg:left-6 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass-panel border border-white/10 transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:h-11 lg:w-11"
        onClick={() => goToSlide(indexRef.current - 1)}
        type="button"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          chevron_left
        </span>
      </button>
      <button
        aria-label="Next hero slide"
        className="hidden md:flex absolute right-3 lg:right-6 top-1/2 z-20 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass-panel border border-white/10 transition-colors hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:h-11 lg:w-11"
        onClick={() => goToSlide(indexRef.current + 1)}
        type="button"
      >
        <span className="material-symbols-outlined text-lg" aria-hidden="true">
          chevron_right
        </span>
      </button>
      <div className="absolute bottom-4 md:bottom-5 right-margin-mobile md:right-margin-desktop z-20 flex items-center gap-3">
        {heroSlides.map((slide, i) => (
          <button
            aria-label={`Go to slide ${i + 1}`}
            className={`hero-dot ${i === currentIndex ? "active" : ""}`}
            key={slide.card.title}
            onClick={() => goToSlide(i)}
          ></button>
        ))}
      </div>
    </section>
  );
}
