import { lazy, Suspense, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Footer from "./components/Footer.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import Navbar from "./components/Navbar.jsx";
import QuizModal from "./components/QuizModal.jsx";
import { useProducts } from "./hooks/useProducts.js";
import { apiPatch } from "./utils/api.js";

// Rendered before any route is reached, so it stays a static import.
import AgeVerification from "./pages/age-verification.jsx";
import { CartProvider } from "./pages/CartContext.jsx";
import { WishlistProvider } from "./pages/WishlistContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Every other page is lazy-loaded so each route ships as its own chunk
// instead of bloating the main bundle.
const AboutUs = lazy(() => import("./pages/about-us.jsx"));
const ContactUs = lazy(() => import("./pages/contact-us.jsx"));
const ShippingPolicy = lazy(() => import("./pages/shipping-policy.jsx"));
const ReturnsRefunds = lazy(() => import("./pages/returns-refunds.jsx"));
const TermsConditions = lazy(() => import("./pages/terms-conditions.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy.jsx"));
const Auth = lazy(() => import("./pages/auth.jsx"));
const BestSellersPage = lazy(() => import("./pages/best-sellers.jsx"));
const Cart = lazy(() => import("./pages/cart.jsx"));
const Checkout = lazy(() => import("./pages/checkout.jsx"));
const ForgotPassword = lazy(() => import("./pages/forgot-password.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const PasswordReset = lazy(() => import("./pages/password-reset.jsx"));
const ProductDetail = lazy(() => import("./pages/product-detail.jsx"));
const OrderDetail = lazy(() => import("./pages/order-detail.jsx"));
const OrderHistory = lazy(() => import("./pages/order-history.jsx"));
const Profile = lazy(() => import("./pages/profile.jsx"));
const SearchResults = lazy(() => import("./pages/search-results.jsx"));
const Wishlist = lazy(() => import("./pages/wishlist.jsx"));

// Each of these owns one nav section (Beer & Cider, Premix, Spirits, Whisky,
// Wine, Zero % Alcohol) and every one of its subcategories from a single
// folder — the URL slug picks the subcategory internally instead of needing
// a dedicated file per subcategory. Offers & Services is the exception: each
// of its subcategories (General Promotions, Gift Cards, Members, Clearance,
// Shop All, In-Store Promotions) has its own dedicated page below.
const BeerCider = lazy(() => import("./pages/beer-cider/Layout.jsx"));
const Clearance = lazy(() => import("./pages/offers-services/Clearance.jsx"));
const GeneralPromotions = lazy(
  () => import("./pages/offers-services/GeneralPromotions.jsx")
);
const GiftCards = lazy(() => import("./pages/offers-services/GiftCards.jsx"));
const InStorePromotions = lazy(
  () => import("./pages/offers-services/InStorePromotions.jsx")
);
const OffersServices = lazy(() => import("./pages/offers-services/Layout.jsx"));
const Members = lazy(() => import("./pages/offers-services/Members.jsx"));
const ShopAll = lazy(() => import("./pages/offers-services/ShopAll.jsx"));
const Premix = lazy(() => import("./pages/premix/Layout.jsx"));
const Spirits = lazy(() => import("./pages/spirits/Layout.jsx"));
const Whisky = lazy(() => import("./pages/whisky/Layout.jsx"));
const Wine = lazy(() => import("./pages/wine/Layout.jsx"));
const ZeroAlcohol = lazy(() => import("./pages/zero-alcohol/Layout.jsx"));
const JacobsCreek = lazy(() => import("./pages/brand-pages/JacobsCreek.jsx"));
const Lindemans = lazy(() => import("./pages/brand-pages/lindemans.jsx"));
const McGuigan = lazy(() => import("./pages/brand-pages/McGuigan.jsx"));
const Penfolds = lazy(() => import("./pages/brand-pages/penfolds.jsx"));
const Pepperjack = lazy(() => import("./pages/brand-pages/pepperjack.jsx"));
const SquealingPig = lazy(() => import("./pages/brand-pages/SquealingPig.jsx"));
const Taylors = lazy(() => import("./pages/brand-pages/taylors.jsx"));
// The brands below don't have their content built out yet — each file is a
// placeholder "coming soon" page. Filling one in only means editing that
// brand's own file; nothing here in App.jsx needs to change.
const NineteenCrimes = lazy(() => import("./pages/brand-pages/19-crimes.jsx"));
const Absolut = lazy(() => import("./pages/brand-pages/absolut.jsx"));
const Belena = lazy(() => import("./pages/brand-pages/belena.jsx"));
const BrownBrothers = lazy(
  () => import("./pages/brand-pages/brown-brothers.jsx")
);
const BundabergRum = lazy(() => import("./pages/brand-pages/bundaberg.jsx"));
const CanadianClub = lazy(
  () => import("./pages/brand-pages/cananidan-club.jsx")
);
const Coopers = lazy(() => import("./pages/brand-pages/coopers.jsx"));
const DeBortoli = lazy(() => import("./pages/brand-pages/de-bortoli.jsx"));
const Farmhand = lazy(() => import("./pages/brand-pages/farm-hand.jsx"));
const GrantBurge = lazy(() => import("./pages/brand-pages/grant-burge.jsx"));
const GreatNorthernBrewingCo = lazy(
  () => import("./pages/brand-pages/great-northtern-brewing.co.jsx")
);
const HardRated = lazy(() => import("./pages/brand-pages/hard-rated.jsx"));
const Hardys = lazy(() => import("./pages/brand-pages/hardys.jsx"));
const JackDaniels = lazy(() => import("./pages/brand-pages/jack-daniels.jsx"));
const Jameson = lazy(() => import("./pages/brand-pages/jameson.jsx"));
const JimBeam = lazy(() => import("./pages/brand-pages/jim-beam.jsx"));
const JohnnieWalker = lazy(
  () => import("./pages/brand-pages/jonnie-walker.jsx")
);
const Smirnoff = lazy(() => import("./pages/brand-pages/smrinoff.jsx"));
const Suntory = lazy(() => import("./pages/brand-pages/suntory.jsx"));
const TreadSoftly = lazy(() => import("./pages/brand-pages/tread-softly.jsx"));
const VodkaCruiser = lazy(
  () => import("./pages/brand-pages/vodka-crusier.jsx")
);
const WildTurkey = lazy(() => import("./pages/brand-pages/wild-turkey.jsx"));
const WolfBlass = lazy(() => import("./pages/brand-pages/wolf-blass.jsx"));
const Woodstock = lazy(() => import("./pages/brand-pages/woodstock.jsx"));
const Yalumba = lazy(() => import("./pages/brand-pages/yalumba.jsx"));
const Yellowtail = lazy(() => import("./pages/brand-pages/yellowtail.jsx"));

// Shown briefly while a route's chunk is fetched.
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-on-surface-variant">Loading…</p>
    </div>
  );
}
// Safely read JSON data from localStorage. If the key is missing or
// contains invalid JSON, return the provided fallback value.
function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

// Convert carts saved while pack selections were represented as an array into
// normal cart lines. Older single-quantity carts continue to work unchanged.
function normalizeStoredCart(items) {
  if (!Array.isArray(items)) return [];

  return items.flatMap((item) => {
    const selections = Array.isArray(item.quantity)
      ? item.quantity
      : [{ packSize: item.packSize ?? 1, quantity: item.quantity }];

    return selections
      .map(({ packSize = 1, quantity }) => ({
        ...item,
        packSize: Number(packSize) || 1,
        quantity: Number(quantity) || 0,
      }))
      .filter(({ quantity }) => quantity > 0);
  });
}

export default function App() {
  const [ageVerified, setAgeVerified] = useState(() =>
    readStored("sipnow-age-verified", false)
  );
  const [quizOpen, setQuizOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const session = readStored("sipnow-session", null);
    const key = session?.email
      ? `sipnow-cart:${session.email.toLowerCase()}`
      : "sipnow-cart";
    return normalizeStoredCart(readStored(key, []));
  });
  const [user, setUser] = useState(() => readStored("sipnow-session", null));
  const [wishlistItems, setWishlistItems] = useState(() => {
    const session = readStored("sipnow-session", null);
    return session?.email
      ? readStored(`sipnow-wishlist:${session.email.toLowerCase()}`, [])
      : [];
  });
  const [wishlistNotice, setWishlistNotice] = useState(null);
  const [authDestination, setAuthDestination] = useState("profile");
  const { products, loading: productsLoading } = useProducts();

  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.packSize ?? 1),
    0
  );

  // Carts survive logout/login but remain associated with the account that
  // created them. Anonymous visitors retain a separate guest cart.
  useEffect(() => {
    const key = user?.email
      ? `sipnow-cart:${user.email.toLowerCase()}`
      : "sipnow-cart";
    window.localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user?.email]);

  // Persist wishlist changes so it survives a page refresh.
  useEffect(() => {
    if (user?.email) {
      window.localStorage.setItem(
        `sipnow-wishlist:${user.email.toLowerCase()}`,
        JSON.stringify(wishlistItems)
      );
    }
  }, [user?.email, wishlistItems]);

  useEffect(() => {
    if (products.length > 0 && cartItems.length > 0) {
      setCartItems((current) => {
        let changed = false;
        const updated = current.map((item) => {
          const dbProduct = products.find((p) => p.name === item.product.name);
          if (dbProduct && dbProduct.stockQuantity !== item.product.stockQuantity) {
            changed = true;
            return {
              ...item,
              product: {
                ...item.product,
                stockQuantity: dbProduct.stockQuantity,
                inStock: dbProduct.inStock,
              },
            };
          }
          return item;
        });
        return changed ? updated : current;
      });
    }
  }, [products]);

  useEffect(() => {
    if (!wishlistNotice) return undefined;
    const timer = window.setTimeout(() => setWishlistNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [wishlistNotice]);

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Home's child components (category cards, in-store-promotions banner)
  // still speak the old "page key" navigation vocabulary; translate it to routes.
  const goToPage = (target) => {
    const key = target.startsWith("category:")
      ? target.slice("category:".length)
      : target;

    let path = `/${key}`;
    if (key === "beer") {
      path = "/beer-cider";
    } else if (key === "zero-proof" || key === "zero") {
      path = "/zero-alcohol";
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchAuthPage = (nextPage) => {
    navigate(`/${nextPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add every chosen pack size as its own cart line. Keeping the pack size
  // means one individual stays labelled "1 individual" instead of being
  // flattened into a case-sized quantity.
  const addToCart = (product, selections = [{ packSize: 1, quantity: 1 }]) => {
    const normalizedSelections = (
      Array.isArray(selections)
        ? selections
        : [{ packSize: 1, quantity: selections }]
    ).filter(({ quantity }) => Number(quantity) > 0);

    normalizedSelections.forEach(({ packSize = 1, quantity }) => {
      const unitsChange = (Number(quantity) || 0) * (Number(packSize) || 1);
      if (product._id) {
        apiPatch(`/products/${product._id}/stock`, { amount: -unitsChange })
          .catch((err) => console.error("Failed to update stock on add", err));
      }
    });

    setCartItems((current) =>
      normalizedSelections.reduce((items, { packSize = 1, quantity }) => {
        const numericPackSize = Number(packSize) || 1;
        const numericQuantity = Number(quantity) || 0;
        const existingLine = items.find(
          (item) =>
            item.product.name === product.name &&
            (item.packSize ?? 1) === numericPackSize
        );

        return existingLine
          ? items.map((item) =>
              item === existingLine
                ? {
                    ...item,
                    quantity: item.quantity + numericQuantity,
                    product: {
                      ...item.product,
                      stockQuantity: Math.max(
                        0,
                        (item.product.stockQuantity ?? 0) -
                          numericQuantity * numericPackSize
                      ),
                    },
                  }
                : item
            )
          : [
              ...items,
              {
                product: {
                  ...product,
                  stockQuantity: Math.max(
                    0,
                    (product.stockQuantity ?? 0) -
                      numericQuantity * numericPackSize
                  ),
                },
                packSize: numericPackSize,
                quantity: numericQuantity,
              },
            ];
      }, current)
    );
  };

  const updateCartQuantity = (productName, packSize = 1, quantity) => {
    const existing = cartItems.find(
      (item) =>
        item.product.name === productName && (item.packSize ?? 1) === packSize
    );
    if (!existing) return;

    const diff = quantity - existing.quantity;
    if (diff === 0) return;

    const unitsChange = diff * packSize;

    if (existing.product._id) {
      apiPatch(`/products/${existing.product._id}/stock`, {
        amount: -unitsChange,
      }).catch((err) => console.error("Failed to update stock", err));
    }

    setCartItems((current) =>
      quantity <= 0
        ? current.filter(
            (item) =>
              item.product.name !== productName ||
              (item.packSize ?? 1) !== packSize
          )
        : current.map((item) =>
            item.product.name === productName &&
            (item.packSize ?? 1) === packSize
              ? {
                  ...item,
                  quantity,
                  product: {
                    ...item.product,
                    stockQuantity: Math.max(
                      0,
                      (item.product.stockQuantity ?? 0) - unitsChange
                    ),
                  },
                }
              : item
          )
    );
  };

  const updateCartSelections = (product, selections = []) => {
    const nextSelections = selections.map(({ packSize = 1, quantity }) => ({
      packSize: Number(packSize) || 1,
      quantity: Math.max(0, Number(quantity) || 0),
    }));
    const selectedPackSizes = new Set(
      nextSelections.map(({ packSize }) => packSize)
    );

    let totalUnitsChange = 0;
    nextSelections.forEach(({ packSize, quantity }) => {
      const existing = cartItems.find(
        (item) =>
          item.product.name === product.name &&
          (item.packSize ?? 1) === packSize
      );
      const oldQty = existing ? existing.quantity : 0;
      totalUnitsChange += (quantity - oldQty) * packSize;
    });

    cartItems.forEach((item) => {
      if (
        item.product.name === product.name &&
        !selectedPackSizes.has(item.packSize ?? 1)
      ) {
        totalUnitsChange -= item.quantity * (item.packSize ?? 1);
      }
    });

    if (totalUnitsChange !== 0 && product._id) {
      apiPatch(`/products/${product._id}/stock`, {
        amount: -totalUnitsChange,
      }).catch((err) =>
        console.error("Failed to update stock on selections", err)
      );
    }

    setCartItems((current) => {
      const unchangedItems = current.filter(
        (item) =>
          item.product.name !== product.name ||
          !selectedPackSizes.has(item.packSize ?? 1)
      );
      const updatedLines = nextSelections
        .filter(({ quantity }) => quantity > 0)
        .map(({ packSize, quantity }) => {
          const existing = current.find(
            (item) =>
              item.product.name === product.name &&
              (item.packSize ?? 1) === packSize
          );
          const oldQty = existing ? existing.quantity : 0;
          const currentProd = existing ? existing.product : product;
          return {
            product: {
              ...currentProd,
              stockQuantity: Math.max(
                0,
                (currentProd.stockQuantity ?? 0) -
                  (quantity - oldQty) * packSize
              ),
            },
            packSize,
            quantity,
          };
        });

      return [...unchangedItems, ...updatedLines];
    });
  };

  const removeFromCart = (productName, packSize = 1) => {
    const existing = cartItems.find(
      (item) =>
        item.product.name === productName && (item.packSize ?? 1) === packSize
    );
    if (existing) {
      const unitsRefund = existing.quantity * packSize;
      if (existing.product._id) {
        apiPatch(`/products/${existing.product._id}/stock`, {
          amount: unitsRefund,
        }).catch((err) => console.error("Failed to refund stock", err));
      }
    }
    setCartItems((current) =>
      current.filter(
        (item) =>
          item.product.name !== productName || (item.packSize ?? 1) !== packSize
      )
    );
  };

  const isWishlisted = (product) =>
    wishlistItems.some((item) => item.name === product.name);

  const toggleWishlist = (product) => {
    if (!user) {
      setAuthDestination("wishlist");
      navigate("/login", {
        state: {
          authNotice:
            "Please sign in or create an account to use your wishlist.",
        },
      });
      return false;
    }
    setWishlistItems((current) => {
      const exists = current.some((item) => item.name === product.name);
      if (exists)
        setWishlistNotice(
          `${product.name} has been removed from your wishlist.`
        );
      return exists
        ? current.filter((item) => item.name !== product.name)
        : [...current, product];
    });
    return true;
  };

  // Save the authenticated session without storing the password in App state.
  const authenticate = (nextUser) => {
    setUser({
      ...nextUser,
      name: nextUser.name,
      email: nextUser.email,
      mobile: nextUser.mobile,
    });
    setCartItems(
      normalizeStoredCart(
        readStored(`sipnow-cart:${nextUser.email.toLowerCase()}`, [])
      )
    );
    setWishlistItems(
      readStored(`sipnow-wishlist:${nextUser.email.toLowerCase()}`, [])
    );
    switchAuthPage(authDestination);
  };

  // Users must be logged in before they can reach checkout.
  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
      return;
    }
    setAuthDestination("checkout");
    switchAuthPage("signup");
  };

  // Merge profile changes into the stored demo user and active session.
  const saveProfile = (updatedUser) => {
    const savedUser = readStored("sipnow-user", {});
    const nextUser = { ...savedUser, ...user, ...updatedUser };
    window.localStorage.setItem("sipnow-user", JSON.stringify(nextUser));
    window.localStorage.setItem("sipnow-session", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  // End the current demo session and return to the home page.
  const logout = () => {
    window.localStorage.removeItem("sipnow-session");
    setUser(null);
    setCartItems(normalizeStoredCart(readStored("sipnow-cart", [])));
    setWishlistItems([]);
    goHome();
  };

  // Confirming age is remembered so returning visitors aren't re-gated.
  const confirmAge = () => {
    window.localStorage.setItem("sipnow-age-verified", JSON.stringify(true));
    setAgeVerified(true);
  };

  // Block the entire site behind the age gate until it's confirmed — this
  // runs like a landing page rather than a modal layered over the site.
  if (!ageVerified) {
    return <AgeVerification onConfirm={confirmAge} />;
  }

  return (
    <CartProvider
      cartItems={cartItems}
      onUpdateSelections={updateCartSelections}
    >
      <WishlistProvider
        wishlistItems={wishlistItems}
        wishlistNotice={wishlistNotice}
        isWishlisted={isWishlisted}
        toggleWishlist={toggleWishlist}
      >
        <AmbientBackground />
        <ScrollToTop />
        <Navbar
          cartCount={cartCount}
          wishlistCount={wishlistItems.length}
          products={products}
          user={user}
        />

        <main className="relative z-10">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onAddToCart={addToCart}
                    onNavigate={goToPage}
                    onStartQuiz={() => setQuizOpen(true)}
                    products={products}
                  />
                }
              />

              <Route
                path="/cart"
                element={
                  <Cart
                    cartItems={cartItems}
                    isLoggedIn={Boolean(user)}
                    onCheckout={handleCheckout}
                    onRemove={removeFromCart}
                    onRequireSignUp={handleCheckout}
                    onShopAll={() => navigate("/shop-all")}
                    onUpdateQuantity={updateCartQuantity}
                    onBack={goHome}
                  />
                }
              />

              <Route
                path="/wishlist"
                element={
                  user ? (
                    <Wishlist
                      onAddToCart={addToCart}
                      onBack={goHome}
                      onShopAll={() => navigate("/shop-all")}
                    />
                  ) : (
                    <Navigate
                      replace
                      to="/login"
                      state={{
                        authNotice:
                          "Please sign in or create an account to view your wishlist.",
                      }}
                    />
                  )
                }
              />

              <Route
                path="/checkout"
                element={
                  <Checkout
                    cartItems={cartItems}
                    onOrderComplete={() => {
                      setCartItems([]);
                      navigate("/profile");
                    }}
                    onProfileSave={saveProfile}
                    user={user}
                  />
                }
              />
              <Route
                path="/orders/:orderNumber"
                element={
                  user ? (
                    <OrderDetail user={user} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/order-history"
                element={
                  user ? (
                    <OrderHistory user={user} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  user ? (
                    <Profile
                      onBack={goHome}
                      onLogout={logout}
                      onSave={saveProfile}
                      onShopAll={() => navigate("/shop-all")}
                      user={user}
                    />
                  ) : (
                    <Auth
                      mode="login"
                      onAuthenticated={authenticate}
                      onSwitch={switchAuthPage}
                    />
                  )
                }
              />

              <Route
                path="/login"
                element={
                  <Auth
                    mode="login"
                    onAuthenticated={authenticate}
                    onSwitch={switchAuthPage}
                  />
                }
              />

              <Route
                path="/signup"
                element={
                  <Auth
                    mode="signup"
                    onAuthenticated={authenticate}
                    onSwitch={switchAuthPage}
                  />
                }
              />

              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/reset-password" element={<PasswordReset />} />

              <Route
                path="/product/:slug"
                element={
                  <ProductDetail onAddToCart={addToCart} products={products} />
                }
              />

              <Route
                path="/shop-all"
                element={
                  <ShopAll
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/best-sellers"
                element={
                  <BestSellersPage
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                  />
                }
              />

              <Route
                path="/search"
                element={
                  <SearchResults
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/in-store-promotions"
                element={
                  <InStorePromotions onAddToCart={addToCart} onBack={goHome} />
                }
              />

              <Route path="/about-us" element={<AboutUs onBack={goHome} />} />
              <Route
                path="/about"
                element={<Navigate replace to="/about-us" />}
              />

              <Route
                path="/contact-us"
                element={<ContactUs onBack={goHome} />}
              />
              <Route
                path="/contact"
                element={<Navigate replace to="/contact-us" />}
              />

              <Route
                path="/shipping-policy"
                element={<ShippingPolicy onBack={goHome} />}
              />
              <Route
                path="/shipping-info"
                element={<Navigate replace to="/shipping-policy" />}
              />

              <Route
                path="/returns-refunds"
                element={<ReturnsRefunds onBack={goHome} />}
              />
              <Route
                path="/returns"
                element={<Navigate replace to="/returns-refunds" />}
              />
              <Route
                path="/refunds"
                element={<Navigate replace to="/returns-refunds" />}
              />

              <Route
                path="/terms-conditions"
                element={<TermsConditions onBack={goHome} />}
              />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicy onBack={goHome} />}
              />
              <Route
                path="/terms"
                element={<Navigate replace to="/terms-conditions" />}
              />
              <Route
                path="/terms-of-service"
                element={<Navigate replace to="/terms-conditions" />}
              />
              {/* Zero % Alcohol Subcategories - Single Unified Component */}
              <Route
                path="/zero-alcohol/:subcategory"
                element={
                  <ZeroAlcohol
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero/:subcategory"
                element={
                  <ZeroAlcohol
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-proof"
                element={
                  <ZeroAlcohol
                    subcategory="all"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero"
                element={
                  <ZeroAlcohol
                    subcategory="all"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-alcohol"
                element={
                  <ZeroAlcohol
                    subcategory="all"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-wine"
                element={
                  <ZeroAlcohol
                    subcategory="wine"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-beer"
                element={
                  <ZeroAlcohol
                    subcategory="beer"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-spirits"
                element={
                  <ZeroAlcohol
                    subcategory="spirits"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-premix"
                element={
                  <ZeroAlcohol
                    subcategory="premix"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/zero-cider"
                element={
                  <ZeroAlcohol
                    subcategory="cider"
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/offers"
                element={
                  <OffersServices
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                  />
                }
              />

              <Route
                path="/offers/general-promotions"
                element={
                  <GeneralPromotions
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                  />
                }
              />

              <Route
                path="/offers/gift-cards"
                element={
                  <GiftCards
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                  />
                }
              />

              <Route
                path="/offers/members"
                element={
                  <Members
                    user={user}
                    onAddToCart={addToCart}
                    onBack={goHome}
                    onRequireSignUp={() => {
                      setAuthDestination("offers/members");
                      switchAuthPage("signup");
                    }}
                    products={products}
                  />
                }
              />

              <Route
                path="/offers/clearance"
                element={
                  <Clearance
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                  />
                }
              />

              <Route
                path="/beer"
                element={<Navigate to="/beer-cider" replace />}
              />

              <Route
                path="/beer-cider"
                element={
                  <BeerCider
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/beer-cider/:categoryKey"
                element={
                  <BeerCider
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/premix"
                element={
                  <Premix
                    onAddToCart={addToCart}
                    products={products}
                    productsLoading={productsLoading}
                    title="Premix"
                  />
                }
              />

              <Route
                path="/premix/:categoryKey"
                element={
                  <Premix
                    onAddToCart={addToCart}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/spirits"
                element={
                  <Spirits
                    onAddToCart={addToCart}
                    onBack={() => goToPage("/")}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/spirits/:categoryKey"
                element={
                  <Spirits
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/whisky"
                element={
                  <Whisky
                    onAddToCart={addToCart}
                    onBack={() => goToPage("/")}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/whisky/:categoryKey"
                element={
                  <Whisky
                    onAddToCart={addToCart}
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/wine"
                element={
                  <Wine
                    onAddToCart={addToCart}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />

              <Route
                path="/wine/:wineType"
                element={
                  <Wine
                    onAddToCart={addToCart}
                    products={products}
                    productsLoading={productsLoading}
                  />
                }
              />
              <Route
                path="/brands/jacob-s-creek"
                element={
                  <JacobsCreek
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/lindeman-s"
                element={
                  <Lindemans
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />

              <Route
                path="/brands/mcguigan"
                element={
                  <McGuigan
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />

              <Route
                path="/brands/taylors"
                element={
                  <Taylors
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/penfolds"
                element={
                  <Penfolds
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />

              <Route
                path="/brands/taylor-s"
                element={
                  <Taylors
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/pepperjack"
                element={
                  <Pepperjack
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/squealing-pig"
                element={
                  <SquealingPig
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />

              <Route
                path="/taylors"
                element={
                  <Taylors
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />

              {/* Brands without built-out content yet — placeholder pages,
                  see the lazy imports above. Slugs mirror what the "Brands"
                  mega-menu generates in utils/shopRoutes.js. */}
              <Route
                path="/brands/19-crimes"
                element={<NineteenCrimes onBack={goHome} />}
              />
              <Route
                path="/brands/absolut"
                element={<Absolut onBack={goHome} />}
              />
              <Route
                path="/brands/belena"
                element={<Belena onBack={goHome} />}
              />
              <Route
                path="/brands/brown-brothers"
                element={<BrownBrothers onBack={goHome} />}
              />
              <Route
                path="/brands/bundaberg-rum"
                element={<BundabergRum onBack={goHome} />}
              />
              <Route
                path="/brands/canadian-club"
                element={<CanadianClub onBack={goHome} />}
              />
              <Route
                path="/brands/coopers"
                element={
                  <Coopers
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/de-bortoli"
                element={<DeBortoli onBack={goHome} />}
              />
              <Route
                path="/brands/farmhand"
                element={
                  <Farmhand
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/grant-burge"
                element={<GrantBurge onBack={goHome} />}
              />
              <Route
                path="/brands/great-northern-brewing-co"
                element={
                  <GreatNorthernBrewingCo
                    onBack={goHome}
                    products={products}
                    productsLoading={productsLoading}
                    onAddToCart={addToCart}
                  />
                }
              />
              <Route
                path="/brands/hard-rated"
                element={<HardRated onBack={goHome} />}
              />
              <Route
                path="/brands/hardys"
                element={<Hardys onBack={goHome} />}
              />
              <Route
                path="/brands/jack-daniel-s"
                element={<JackDaniels onBack={goHome} />}
              />
              <Route
                path="/brands/jameson"
                element={<Jameson onBack={goHome} />}
              />
              <Route
                path="/brands/jim-beam"
                element={<JimBeam onBack={goHome} />}
              />
              <Route
                path="/brands/johnnie-walker"
                element={<JohnnieWalker onBack={goHome} />}
              />
              <Route
                path="/brands/smirnoff"
                element={<Smirnoff onBack={goHome} />}
              />
              <Route
                path="/brands/suntory"
                element={<Suntory onBack={goHome} />}
              />
              <Route
                path="/brands/tread-softly"
                element={<TreadSoftly onBack={goHome} />}
              />
              <Route
                path="/brands/vodka-cruiser"
                element={<VodkaCruiser onBack={goHome} />}
              />
              <Route
                path="/brands/wild-turkey"
                element={<WildTurkey onBack={goHome} />}
              />
              <Route
                path="/brands/wolf-blass"
                element={<WolfBlass onBack={goHome} />}
              />
              <Route
                path="/brands/woodstock"
                element={<Woodstock onBack={goHome} />}
              />
              <Route
                path="/brands/yalumba"
                element={<Yalumba onBack={goHome} />}
              />
              <Route
                path="/brands/yellowtail"
                element={<Yellowtail onBack={goHome} />}
              />

              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Suspense>
        </main>

        {!["/login", "/signup", "/forgot-password", "/reset-password"].includes(
          location.pathname
        ) && <Footer />}

        <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      </WishlistProvider>
    </CartProvider>
  );
}
