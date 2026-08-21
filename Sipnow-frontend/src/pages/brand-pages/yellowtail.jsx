// import PageHero from "../../components/PageHero.jsx";

// const BRAND_NAME = "Yellowtail";

// TODO: build out real brand content/products here, same pattern as
// JacobsCreek.jsx. Already routed at /brands/yellowtail in App.jsx —
// no App.jsx changes needed to finish this page.
// export default function Yellowtail({ onBack }) {
//   return (
//     <div className="min-h-screen bg-background text-on-surface py-16 md:py-24">
//       <PageHero
//         onBack={onBack}
//         tag="Brand"
//         title={BRAND_NAME}
//         description={`The ${BRAND_NAME} collection is coming soon.`}
//       />
//     </div>
//   );
// }
import { useMemo } from "react";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import yellowtailBanner from "../../assets/brandimages/Yellowtail.png";

const BRAND_NAME = "Yellowtail";

export default function Yellowtail({
  products = [],
  productsLoading = false,
  onAddToCart,
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  /*
   * ============================================================
   * BRAND PRODUCTS
   * ============================================================
   */

  const brandProducts = useMemo(() => {
    return products.filter((product) => {
      const brand = String(product.brand || product.brandName || "")
        .trim()
        .toLowerCase();

      const name = String(product.name || "")
        .trim()
        .toLowerCase();

      return (
        brand === "yellowtail" ||
        brand === "yellow tail" ||
        name.includes("yellowtail") ||
        name.includes("yellow tail")
      );
    });
  }, [products]);

  /*
   * ============================================================
   * BEST SELLING PRODUCTS
   * ============================================================
   */

  const bestSellingProducts = useMemo(() => {
    return [...brandProducts]
      .sort(
        (a, b) =>
          Number(b.salesCount || b.soldCount || b.unitsSold || 0) -
          Number(a.salesCount || a.soldCount || a.unitsSold || 0)
      )
      .slice(0, 6);
  }, [brandProducts]);

  /*
   * ============================================================
   * BEST RATED PRODUCTS
   * ============================================================
   */

  const bestRatedProducts = useMemo(() => {
    return [...brandProducts]
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 6);
  }, [brandProducts]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* ========================================================
          BRAND BANNER
      ======================================================== */}

      <section className="relative w-full overflow-hidden">
        <img
          src={yellowtailBanner}
          alt={BRAND_NAME}
          className="w-full h-auto object-cover object-top block"
        />
      </section>

      {/* ========================================================
          ABOUT THE BRAND
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-container-max mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-5">
              About the Brand
            </p>

            <h2 className="font-serif text-3xl md:text-5xl text-on-surface">
              Yellowtail Collection
            </h2>

            <p className="mt-6 text-base md:text-lg leading-relaxed text-on-surface-variant">
              Explore our collection of Yellowtail wines, from vibrant reds and
              crisp refreshing whites to joyful bubbles and fruity favourites.
              Discover approachable Australian wines made to be enjoyed for
              everyday moments and celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          BEST SELLING PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-20">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
                Yellowtail
              </p>

              <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
                Best Selling Products
              </h2>

              <p className="mt-3 text-sm md:text-base text-on-surface-variant">
                Discover the most popular Yellowtail products.
              </p>
            </div>
          </div>

          {productsLoading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-on-surface-variant">Loading products...</p>
            </div>
          ) : bestSellingProducts.length > 0 ? (
            <ProductGrid
              addedProduct={addedProduct}
              onAddToCart={handleAddToCart}
              products={bestSellingProducts}
              emptyMessage=""
            />
          ) : (
            <div className="glass-panel rounded-xl border border-primary/10 min-h-[240px] flex items-center justify-center px-6">
              <div className="text-center max-w-lg">
                <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">
                  trending_up
                </span>

                <h3 className="font-serif text-2xl text-on-surface mb-3">
                  Best Selling Products
                </h3>

                <p className="text-on-surface-variant leading-relaxed">
                  Best selling Yellowtail products will appear here once product
                  sales data is available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          BEST RATED PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-20">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
                Yellowtail
              </p>

              <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
                Best Rated Products
              </h2>

              <p className="mt-3 text-sm md:text-base text-on-surface-variant">
                Explore the highest-rated Yellowtail products.
              </p>
            </div>
          </div>

          {productsLoading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <p className="text-on-surface-variant">Loading products...</p>
            </div>
          ) : bestRatedProducts.length > 0 ? (
            <ProductGrid
              addedProduct={addedProduct}
              onAddToCart={handleAddToCart}
              products={bestRatedProducts}
              emptyMessage=""
            />
          ) : (
            <div className="glass-panel rounded-xl border border-primary/10 min-h-[240px] flex items-center justify-center px-6">
              <div className="text-center max-w-lg">
                <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">
                  star
                </span>

                <h3 className="font-serif text-2xl text-on-surface mb-3">
                  Best Rated Products
                </h3>

                <p className="text-on-surface-variant leading-relaxed">
                  Best rated Yellowtail products will appear here once product
                  ratings are available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          ALL BRAND PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-24">
        <div className="max-w-container-max mx-auto">
          <div className="mb-8">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              Our Collection
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              All Yellowtail Products
            </h2>
          </div>

          {brandProducts.length > 0 ? (
            <ProductGrid
              addedProduct={addedProduct}
              onAddToCart={handleAddToCart}
              products={brandProducts}
              emptyMessage=""
            />
          ) : (
            <div className="glass-panel rounded-xl border border-primary/10 min-h-[240px] flex items-center justify-center px-6">
              <div className="text-center max-w-lg">
                <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">
                  wine_bar
                </span>

                <h3 className="font-serif text-2xl text-on-surface mb-3">
                  Yellowtail Products
                </h3>

                <p className="text-on-surface-variant leading-relaxed">
                  Yellowtail products will appear here once they are available
                  in our collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
