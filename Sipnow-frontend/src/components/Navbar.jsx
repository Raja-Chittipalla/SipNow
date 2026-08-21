import { useEffect, useMemo, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useNavMenus } from "../hooks/useContent.js";
import { matchBrands } from "../utils/brandDirectory.js";
import { getProductSlug } from "../utils/productHelpers.js";
import {
  MAX_SEARCH_LENGTH,
  validateSearchTerm,
} from "../utils/searchValidation.js";
import {
  TOP_LEVEL_ROUTES as SHOP_TOP_LEVEL_ROUTES,
  getMenuItemRoute,
  slugify,
} from "../utils/shopRoutes.js";
import sipnowLogo from "../assets/sipnow-logo.png";

// ========================================
// TOP LEVEL ROUTES
// ========================================

const TOP_LEVEL_ROUTES = {
  ...SHOP_TOP_LEVEL_ROUTES,
  "Offers & Services": "/offers",
  "Shop All": "/shop-all",
  "In-Store promotions": "/in-store-promotions",
};

const mobileNavLinks = [
  "Offers & Services",
  "Beer & Cider",
  "Premix",
  "Wine",
  "Spirits",
  "Whisky",
  "Zero %",
  "Brands",
];

// ========================================
// FEATURED PANEL
// ========================================

// Renders the promotional/featured card displayed inside a mega menu.
function FeaturedPanel({ featured }) {
  if (!featured) {
    return null;
  }

  // Image only
  if (featured.type === "image-only") {
    return (
      <div className="bg-surface-container-high rounded-xl border overflow-hidden border-primary/20">
        <img
          className="h-full w-full object-cover"
          src={featured.image}
          alt=""
        />
      </div>
    );
  }

  // Icon panel
  if (featured.type === "icon") {
    return (
      <div className="bg-surface-container-high rounded-xl p-6 border border-primary/20 flex flex-col justify-center items-center text-center">
        <span className="material-symbols-outlined text-primary text-5xl mb-3">
          {featured.icon}
        </span>

        <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">
          {featured.tag}
        </p>

        <p className="text-sm font-semibold">{featured.title}</p>
      </div>
    );
  }

  // Image + text panel
  return (
    <div className="bg-surface-container-high rounded-xl p-6 border border-primary/20 relative overflow-hidden group/card">
      <img
        className="rounded-lg mb-4 h-32 w-full object-cover group-hover/card:scale-110 transition-transform duration-700"
        src={featured.image}
        alt=""
      />

      <p className="text-[10px] text-primary uppercase font-bold tracking-tighter mb-1">
        {featured.tag}
      </p>

      <p className="text-sm font-semibold">{featured.title}</p>
    </div>
  );
}

function SearchError({ message }) {
  if (!message) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-panel border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden z-50">
      <p className="px-6 py-5 text-sm text-error">{message}</p>
    </div>
  );
}

function SearchResults({
  results,
  brandMatches,
  searched,
  onSelect,
  onSelectBrand,
}) {
  if (!searched) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-panel border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden z-50">
      {brandMatches.length > 0 && (
        <ul className="border-b border-outline-variant/20">
          {brandMatches.map((brand) => (
            <li key={brand.route}>
              <button
                type="button"
                onClick={() => onSelectBrand(brand)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                  storefront
                </span>
                <span className="text-sm text-on-surface">{brand.name}</span>
                <span className="ml-auto text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Brand
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && brandMatches.length === 0 ? (
        <p className="px-6 py-5 text-sm text-on-surface-variant">
          No products match your search.
        </p>
      ) : (
        <ul className="max-h-96 overflow-y-auto scrollbar-hide">
          {results.map((product) => (
            <li key={product.name}>
              <button
                type="button"
                onClick={() => onSelect(product)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-primary/10 transition-colors"
              >
                {/* PRODUCT IMAGE */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-high shrink-0 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* PRODUCT INFORMATION */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {product.name}
                  </p>

                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1 truncate">
                    {product.category}
                  </p>
                </div>

                {/* PRICE */}
                <div className="shrink-0 text-right">
                  <p className="text-primary text-sm font-semibold whitespace-nowrap">
                    {product.price}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ========================================
// NAVBAR
// ========================================

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  products = [],
  user,
}) {
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [searchError, setSearchError] = useState("");

  const [searchFocused, setSearchFocused] = useState(false);

  const desktopSearchRef = useRef(null);

  const mobileSearchRef = useRef(null);

  const blurTimeoutRef = useRef(null);

  const menuTimeoutRef = useRef(null);

  const navigate = useNavigate();

  const { data: navMenus = [] } = useNavMenus();

  // ========================================
  // SCROLL
  // ========================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ========================================
  // CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      clearTimeout(blurTimeoutRef.current);
      clearTimeout(menuTimeoutRef.current);
    };
  }, []);

  // ========================================
  // NAVBAR HEIGHT
  // ========================================

  // Exposes the navbar's real rendered height as a CSS variable so
  // fixed-position content below it (e.g. the hero) can offset itself
  // correctly instead of relying on a guessed pixel value.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${nav.offsetHeight}px`
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, []);

  // ========================================
  // MEGA MENU HOVER
  // ========================================

  // A small delay before closing keeps the menu open while the cursor
  // crosses the gap between the nav link and the dropdown panel below it.
  const handleMenuEnter = (label) => {
    clearTimeout(menuTimeoutRef.current);

    setOpenMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200);
  };

  // ========================================
  // SEARCH
  // ========================================

  const normalizedTerm = searchTerm.trim().toLowerCase();

  // Memoized so this only recomputes when the term or catalog changes, not
  // on every Navbar render (e.g. scroll or menu-hover state updates).
  const searchResults = useMemo(() => {
    if (!normalizedTerm) return [];

    const matches = [];
    for (const product of products) {
      const name = product.name?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const categoryGroup = product.categoryGroup?.toLowerCase() || "";
      const type = product.type?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const manufacturer = product.manufacturer?.toLowerCase() || "";

      if (
        name.includes(normalizedTerm) ||
        category.includes(normalizedTerm) ||
        categoryGroup.includes(normalizedTerm) ||
        type.includes(normalizedTerm) ||
        brand.includes(normalizedTerm) ||
        manufacturer.includes(normalizedTerm)
      ) {
        matches.push(product);
        if (matches.length === 6) break;
      }
    }
    return matches;
  }, [normalizedTerm, products]);

  const brandMatches = useMemo(
    () => matchBrands(normalizedTerm),
    [normalizedTerm]
  );

  // ========================================
  // SEARCH FOCUS
  // ========================================

  const handleSearchFocus = () => {
    clearTimeout(blurTimeoutRef.current);

    setSearchFocused(true);
  };

  // ========================================
  // SEARCH BLUR
  // ========================================

  const handleSearchBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setSearchFocused(false);
    }, 150);
  };

  // ========================================
  // SEARCH SUBMIT
  // ========================================

  // Clicking the search icon (or pressing Enter) navigates to the full
  // search results page for whatever's currently typed.
  const handleSearchSubmit = () => {
    const { valid, reason } = validateSearchTerm(searchTerm);
    if (!valid) {
      setSearchError(reason);
      return;
    }

    const term = searchTerm.trim();

    clearTimeout(blurTimeoutRef.current);

    setSearchError("");
    setSearchFocused(false);
    setMobileOpen(false);
    setOpenMenu(null);

    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (searchError) setSearchError("");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // ========================================
  // SEARCH RESULT
  // ========================================

  // Selecting a result navigates to that product's detail page.
  const handleSelectResult = (product) => {
    clearTimeout(blurTimeoutRef.current);

    setSearchFocused(false);
    setSearchTerm("");
    setSearchError("");
    setMobileOpen(false);
    setOpenMenu(null);

    navigate(`/product/${getProductSlug(product)}`);
  };

  // Selecting a brand recommendation navigates to that brand's page.
  const handleSelectBrand = (brand) => {
    clearTimeout(blurTimeoutRef.current);

    setSearchFocused(false);
    setSearchTerm("");
    setSearchError("");
    setMobileOpen(false);
    setOpenMenu(null);

    navigate(brand.route);
  };

  // ========================================
  // SEARCH ICON
  // ========================================

  const focusSearch = () => {
    if (window.matchMedia("(min-width: 1280px)").matches) {
      desktopSearchRef.current?.focus();
    } else {
      setMobileOpen(true);

      setTimeout(() => {
        mobileSearchRef.current?.focus();
      }, 300);
    }
  };

  // ========================================
  // CLOSE MENUS
  // ========================================

  const closeMenus = () => {
    clearTimeout(menuTimeoutRef.current);

    setOpenMenu(null);
    setMobileOpen(false);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-[60] transition-shadow duration-500 bg-surface ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      {/* ================================
          TOP BAR — logo, search, account
          ================================ */}

      <div
        className={`w-full pl-margin-mobile pr-margin-mobile md:pl-margin-desktop md:pr-10 flex items-center gap-4 xl:gap-8 relative transition-all duration-500 ${
          scrolled ? "py-2.5" : "py-3.5"
        }`}
      >
        {/* LOGO */}

        <Link
          to="/"
          className="relative z-10 flex items-center gap-2.5 shrink-0"
          onClick={closeMenus}
        >
          <img
            src={sipnowLogo}
            alt="SipNow Logo"
            className="h-12 md:h-14 w-auto object-contain brightness-110"
          />
        </Link>

        {/* SEARCH — desktop, centered between logo and account actions */}

        <div className="hidden xl:flex flex-col relative flex-1 max-w-xl mx-auto">
          <div className="flex items-center min-w-0 gap-2 rounded-full border border-outline-variant/25 bg-surface-container-high/50 px-4 py-1.5 transition-colors focus-within:border-primary/60 focus-within:bg-surface-container-high hover:border-outline-variant/50">
            <button
              aria-label="Search"
              className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 hover:text-primary transition-colors"
              onClick={handleSearchSubmit}
              type="button"
            >
              search
            </button>

            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full min-w-0 placeholder:text-on-surface-variant/50"
              maxLength={MAX_SEARCH_LENGTH}
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search wine, spirits, beer & more..."
              ref={desktopSearchRef}
              type="text"
              value={searchTerm}
            />
          </div>

          <SearchError message={searchError} />

          <SearchResults
            brandMatches={brandMatches}
            onSelect={handleSelectResult}
            onSelectBrand={handleSelectBrand}
            results={searchResults}
            searched={
              !searchError && searchFocused && normalizedTerm.length > 0
            }
          />
        </div>

        {/* RIGHT SIDE — search icon (mobile) + wishlist + cart + account + menu */}

        <div className="flex items-center gap-1 shrink-0 ml-auto xl:ml-0">
          {/* MOBILE SEARCH BUTTON */}

          <button
            className="xl:hidden material-symbols-outlined hover:text-primary transition-colors mr-2"
            onClick={focusSearch}
            type="button"
          >
            search
          </button>

          {/* WISHLIST */}

          <button
            aria-label={
              wishlistCount > 0
                ? `Wishlist, ${wishlistCount} items`
                : "Wishlist"
            }
            className="group relative flex flex-col items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-outline-variant/30 hover:bg-primary/10"
            onClick={() => {
              closeMenus();
              navigate("/wishlist");
            }}
            type="button"
          >
            <span className="relative inline-flex leading-none">
              <span className="material-symbols-outlined text-2xl leading-none transition-colors group-hover:text-primary">
                favorite
              </span>

              {wishlistCount > 0 && (
                <span
                  key={wishlistCount}
                  className="cart-badge-pop absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-on-primary text-[9px] font-bold leading-none tabular-nums ring-2 ring-surface shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </span>

            <span className="text-[11px] font-medium leading-none text-on-surface-variant transition-colors group-hover:text-primary">
              Wishlist
            </span>
          </button>

          {/* DIVIDER */}

          <div className="hidden sm:block h-8 w-px bg-outline-variant/30" />

          {/* CART */}

          <button
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
            className="group relative flex flex-col items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-outline-variant/30 hover:bg-primary/10"
            onClick={() => {
              closeMenus();
              navigate("/cart");
            }}
            type="button"
          >
            <span className="relative inline-flex leading-none">
              <span className="material-symbols-outlined text-2xl leading-none transition-colors group-hover:text-primary">
                shopping_cart
              </span>

              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="cart-badge-pop absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-primary text-on-primary text-[9px] font-bold leading-none tabular-nums ring-2 ring-surface shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>

            <span className="text-[11px] font-medium leading-none text-on-surface-variant transition-colors group-hover:text-primary">
              Cart
            </span>
          </button>

          {/* DIVIDER */}

          <div className="hidden sm:block h-8 w-px bg-outline-variant/30" />

          {/* ACCOUNT */}

          <button
            aria-label={user ? "My account" : "Sign in"}
            className="group relative hidden sm:flex flex-col items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-outline-variant/30 hover:bg-primary/10"
            onClick={() => {
              closeMenus();
              navigate(user ? "/profile" : "/login");
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl leading-none transition-colors group-hover:text-primary">
              person
            </span>

            <span className="text-[11px] font-medium leading-none text-on-surface-variant transition-colors group-hover:text-primary whitespace-nowrap">
              {user ? "Account" : "Login / Signup"}
            </span>
          </button>

          {/* MOBILE MENU */}

          <button
            aria-controls="mobile-nav-panel"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
            className="material-symbols-outlined lg:hidden hover:text-primary transition-colors ml-1"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            {mobileOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* ================================
          BOTTOM BAR — category navigation
          ================================ */}

      <div className="hidden lg:block bg-surface-container-low border-t border-t-white/5 border-b border-b-primary/25">
        <div className="w-full pl-margin-desktop pr-margin-desktop flex items-center gap-6 xl:gap-8 h-12">
          {navMenus.map((menu) => (
            <div
              className="nav-item h-full flex items-center"
              key={menu.label}
              onMouseEnter={() => handleMenuEnter(menu.label)}
              onMouseLeave={handleMenuLeave}
            >
              {/* TOP LEVEL LABEL (opens the dropdown, does not navigate) */}

              <button
                type="button"
                className={`relative h-full flex items-center gap-1.5 whitespace-nowrap font-label-md text-label-md transition-colors tracking-wide cursor-default ${
                  openMenu === menu.label
                    ? "text-primary"
                    : "text-on-surface/75 hover:text-primary"
                }`}
                onClick={() =>
                  setOpenMenu((current) =>
                    current === menu.label ? null : menu.label
                  )
                }
              >
                {menu.label}

                <span
                  className={`material-symbols-outlined text-[18px] opacity-50 transition-transform ${
                    openMenu === menu.label ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>

                <span
                  className={`absolute left-0 right-0 -bottom-px h-[2px] bg-primary rounded-full transition-transform duration-300 origin-left ${
                    openMenu === menu.label ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              {openMenu === menu.label && (
                <div className="mega-menu absolute left-margin-desktop right-margin-desktop top-[100%]">
                  <div className="mega-menu-panel bg-surface-container-low border border-t-0 border-outline-variant/30 rounded-b-2xl p-10 grid grid-cols-4 gap-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)]">
                    {menu.columns.map((col) =>
                      col.items?.length > 0 ? (
                        <div className="space-y-3" key={col.heading}>
                          <h4 className="font-headline-sm text-lg text-primary whitespace-nowrap">
                            {col.heading}
                          </h4>
                          <ul className="space-y-3 text-sm text-on-surface-variant">
                            {col.items.map((item) => (
                              <li key={item}>
                                <Link
                                  className="hover:text-primary transition-colors"
                                  onClick={closeMenus}
                                  to={getMenuItemRoute(
                                    menu.label,
                                    col.heading,
                                    item
                                  )}
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="space-y-3" key={col.heading}>
                          <Link
                            className="font-headline-sm text-lg text-primary hover:opacity-80 transition-opacity"
                            onClick={closeMenus}
                            to={getMenuItemRoute(
                              menu.label,
                              col.heading,
                              col.heading
                            )}
                          >
                            {col.heading}
                          </Link>
                        </div>
                      )
                    )}
                    {menu.featured && (
                      <FeaturedPanel featured={menu.featured} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE NAVIGATION */}

      <div
        className={`mobile-nav-panel lg:hidden ${mobileOpen ? "open" : ""}`}
        id="mobile-nav-panel"
      >
        <div className="glass-panel border-t border-outline-variant/20 px-margin-mobile py-6 space-y-6">
          {mobileNavLinks.map((link) => (
            <Link
              className="block font-label-md text-label-md text-on-surface/80 hover:text-primary transition-colors tracking-wide"
              key={link}
              onClick={closeMenus}
              to={TOP_LEVEL_ROUTES[link] || `/${slugify(link)}`}
            >
              {link}
            </Link>
          ))}

          <Link
            className="block font-label-md text-label-md text-on-surface/80 hover:text-primary transition-colors tracking-wide"
            onClick={closeMenus}
            to={user ? "/profile" : "/login"}
          >
            My Account
          </Link>

          <div className="relative">
            <div
              className={`flex items-center gap-2 border-b py-2 ${
                searchError ? "border-error" : "border-outline-variant/30"
              }`}
            >
              <button
                aria-label="Search"
                className="material-symbols-outlined text-[20px] text-on-surface-variant hover:text-primary transition-colors"
                onClick={handleSearchSubmit}
                type="button"
              >
                search
              </button>

              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-on-surface-variant/50"
                maxLength={MAX_SEARCH_LENGTH}
                onBlur={handleSearchBlur}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search our cellar..."
                ref={mobileSearchRef}
                type="text"
                value={searchTerm}
              />
            </div>

            <SearchError message={searchError} />

            <SearchResults
              brandMatches={brandMatches}
              onSelect={handleSelectResult}
              onSelectBrand={handleSelectBrand}
              results={searchResults}
              searched={
                !searchError && searchFocused && normalizedTerm.length > 0
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
