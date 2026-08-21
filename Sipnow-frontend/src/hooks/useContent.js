import { useEffect, useState } from "react";
import { navMenus } from "../data/navigation.js";
import {
  LOGO_URL,
  SIPNOW_HERO_BANNER_URL,
  PENFOLDS_URL,
  PRESTIGE_COLLECTION_URL,
} from "../data/images.js";
import {
  apiGet,
  resolveImageUrl,
  calculateDiscountedPrice,
  formatDiscountBadge,
} from "../utils/api.js";

const siteAssets = {
  LOGO_URL,
  SIPNOW_HERO_BANNER_URL,
  PENFOLDS_URL,
  PRESTIGE_COLLECTION_URL,
};

/** Generic hook for content fetched live from the backend API. */
function useApiData(path, initial, transform) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiGet(path)
      .then((json) => {
        if (cancelled) return;
        setData(transform ? transform(json) : json);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, loading, error };
}

export function useCategories() {
  return useApiData("/categories", [], (json) =>
    (json.categories || []).map((category) => ({
      key: category.slug || category._id,
      name: category.name,
      tag: category.description,
      image: resolveImageUrl(category.image),
    }))
  );
}

/** Footer navigation is site UI structure, not catalog/content data. */
export function useFooterColumns() {
  const footerColumns = [
    {
      heading: "Explore",
      links: ["Beer & cider", "Wine", "Whisky", "Premix", "Spirits", "Zero %"],
    },
    {
      heading: "Offer services",
      links: [
        "In-store promotions",
        "General promotions",
        "Membership",
        "Gift cards",
        "Clearance",
      ],
    },
    {
      heading: "Other Services",
      links: [
        "Contact us",
        "About us",
        "My Orders",
        "Shipping Policy",
        "Returns & Refunds",
        "Terms & Conditions",
      ],
    },
  ];

  return { data: footerColumns, loading: false, error: null };
}

export function useHeroSlides() {
  return useApiData("/hero-slides/active", [], (json) =>
    (json.slides || []).map((slide) => ({
      ...slide,
      bgImage: resolveImageUrl(slide.bgImage),
      card: { ...slide.card, image: resolveImageUrl(slide.card?.image) },
    }))
  );
}

export function useInStorePromotions() {
  return useApiData("/offers/active", [], (json) => {
    const promotions = [];

    for (const offer of json.offers || []) {
      for (const product of offer.applicableProducts || []) {
        const price = Number(product.price);
        const discounted = calculateDiscountedPrice(
          price,
          offer.discountType,
          offer.discountValue
        );

        promotions.push({
          image: resolveImageUrl(product.image),
          icon: "wine_bar",
          badgeText: formatDiscountBadge(
            offer.discountType,
            offer.discountValue
          ),
          category: product.category,
          name: product.name,
          rating: product.rating ?? 0,
          reviewCount: product.reviewCount ?? 0,
          originalPrice: `$${price.toFixed(2)}`,
          price: `$${discounted.toFixed(2)}`,
          promoLabel: "In-store only",
        });
      }
    }

    return promotions;
  });
}

export function useNavMenus() {
  return { data: navMenus, loading: false, error: null };
}

export function useQuiz() {
  return useApiData(
    "/quiz",
    { quizQuestions: [], quizResults: {} },
    (json) => ({
      quizQuestions: json.questions || [],
      quizResults: Object.fromEntries(
        (json.results || []).map((result) => [
          result.key,
          { title: result.title, desc: result.desc },
        ])
      ),
    })
  );
}

/** Bundled brand assets — not catalog/content data. */
export function useSiteAssets() {
  return { data: siteAssets, loading: false, error: null };
}

export function useCurrentOffers() {
  return useApiData("/promotions/active", [], (json) =>
    (json.promotions || []).map((promo) => ({
      id: promo._id,
      title: promo.title,
      subtitle: promo.description,
      badge:
        promo.discountType === "none"
          ? ""
          : formatDiscountBadge(promo.discountType, promo.discountValue),
      image: resolveImageUrl(promo.image || promo.bannerImage),
      ctaText: promo.ctaText || "Shop Now",
      targetPage: promo.link || "/shop-all",
      validity: promo.validityLabel || "Limited Time Offer",
    }))
  );
}
