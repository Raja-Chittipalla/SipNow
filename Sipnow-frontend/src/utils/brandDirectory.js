// Flat, searchable list of every brand shown in the Navbar's "Brands" mega
// menu, derived from the same source data so it can never drift out of sync
// with the menu itself.
import { navMenus } from "../data/navigation.js";
import { getMenuItemRoute } from "./shopRoutes.js";

const brandsMenu = navMenus.find((menu) => menu.label === "Brands");

export const BRAND_DIRECTORY = (brandsMenu?.columns ?? []).flatMap((column) =>
  (column.items ?? []).map((name) => ({
    name,
    route: getMenuItemRoute("Brands", column.heading, name),
  }))
);

export function matchBrands(term, limit = 5) {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return [];

  return BRAND_DIRECTORY.filter((brand) =>
    brand.name.toLowerCase().includes(normalized)
  ).slice(0, limit);
}
