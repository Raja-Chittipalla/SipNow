// Canonical slug/route logic for the shop's mega-menu categories, shared by
// the Navbar (mega menu links) and the CategoryFilter (shared listing-page
// filter) so both always resolve the exact same URL for a given category +
// subcategory label.

export const TOP_LEVEL_ROUTES = {
  "Beer & Cider": "/beer-cider",
  Premix: "/premix",
  Spirits: "/spirits",
  Whisky: "/whisky",
  Wine: "/wine",
  "Zero %": "/zero-alcohol",
};

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getMenuItemRoute(menuLabel, columnHeading, item) {
  const itemSlug = slugify(item);

  if (menuLabel === "Offers & Services") {
    switch (item.toLowerCase().trim()) {
      case "shop all":
        return "/shop-all";

      case "best sellers":
        return "/best-sellers";

      case "in-store promotions":
        return "/in-store-promotions";

      case "general promotions":
        return "/offers/general-promotions";

      case "gift cards":
        return "/offers/gift-cards";

      case "members":
        return "/offers/members";

      case "clearance":
        return "/offers/clearance";

      default:
        return `/offers/${itemSlug}`;
    }
  }

  if (menuLabel === "Spirits") {
    return `/spirits/${itemSlug}`;
  }

  if (menuLabel === "Whisky") {
    const whiskyType = item.toLowerCase().trim();

    return whiskyType === "whisky" || whiskyType === "whiskey"
      ? "/whisky"
      : `/whisky/${itemSlug}`;
  }

  if (menuLabel === "Beer & Cider") {
    return `/beer-cider/${itemSlug}`;
  }

  if (menuLabel === "Premix") {
    return `/premix/${itemSlug}`;
  }

  if (menuLabel === "Wine") {
    return `/wine/${itemSlug}`;
  }

  if (
    menuLabel === "Zero %" ||
    menuLabel === "Zero" ||
    menuLabel === "Zero%" ||
    menuLabel.toLowerCase().includes("zero")
  ) {
    const sub = itemSlug.replace("zero-alcohol-", "").replace("zero-", "");
    return `/zero-alcohol/${sub}`;
  }

  if (
    menuLabel === "Zero %" ||
    menuLabel === "Zero" ||
    menuLabel === "Zero%" ||
    menuLabel.toLowerCase().includes("zero")
  ) {
    const sub = itemSlug.replace("zero-alcohol-", "").replace("zero-", "");
    return `/zero-alcohol/${sub}`;
  }

  if (menuLabel === "Brands") {
    switch (item.toLowerCase().trim()) {
      case "johnnie walker":
        return "/brands/johnnie-walker";

      case "jacob's creek":
        return "/brands/jacob-s-creek";

      case "suntory":
        return "/brands/suntory";

      case "absolut":
        return "/brands/absolut";

      case "wild turkey":
        return "/brands/wild-turkey";

      case "bundaberg rum":
        return "/brands/bundaberg-rum";

      default:
        return `/brands/${itemSlug}`;
    }
  }

  return `/${slugify(menuLabel)}/${itemSlug}`;
}
