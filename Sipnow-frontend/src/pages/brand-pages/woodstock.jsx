import { useMemo } from "react";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import woodstockBanner from "../../assets/brandimages/woodstock.png";

const BRAND_NAME = "Woodstock";

export default function Woodstock({
  products = [],
  productsLoading = false,
  onAddToCart,
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  // ============================================================
  // WOODSTOCK PRODUCTS
  // ============================================================

  const brandProducts = useMemo(() => {
    return products.filter((product) => {
      const brand = String(
        product.brand || product.brandName || product.brand_name || ""
      )
        .trim()
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ");

      const name = String(
        product.name || product.productName || product.title || ""
      )
        .trim()
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ");

      return (
        brand === "woodstock" ||
        brand.includes("woodstock") ||
        name.includes("woodstock")
      );
    });
  }, [products]);

  // ============================================================
  // BEST SELLING PRODUCTS
  // ============================================================

  const bestSellingProducts = useMemo(() => {
    return [...brandProducts]
      .sort(
        (a, b) =>
          Number(
            b.salesCount || b.soldCount || b.unitsSold || b.totalSold || 0
          ) -
          Number(a.salesCount || a.soldCount || a.unitsSold || a.totalSold || 0)
      )
      .slice(0, 6);
  }, [brandProducts]);

  // ============================================================
  // BEST RATED PRODUCTS
  // ============================================================

  const bestRatedProducts = useMemo(() => {
    return [...brandProducts]
      .sort(
        (a, b) =>
          Number(b.rating || b.averageRating || b.avgRating || 0) -
          Number(a.rating || a.averageRating || a.avgRating || 0)
      )
      .slice(0, 6);
  }, [brandProducts]);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* ========================================================
          WOODSTOCK BRAND BANNER
      ======================================================== */}

      <section className="relative w-full min-h-[740px] overflow-hidden">
        <img
          src={woodstockBanner}
          alt={BRAND_NAME}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
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
              Woodstock Collection
            </h2>

            <p className="mt-6 text-base md:text-lg leading-relaxed text-on-surface-variant">
              Discover the Woodstock collection and explore a range of products
              from this popular brand.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          BEST SELLING PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-20">
        <div className="max-w-container-max mx-auto">
          <div className="mb-8">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              {BRAND_NAME}
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              Best Selling Products
            </h2>

            <p className="mt-3 text-sm md:text-base text-on-surface-variant">
              Discover the most popular Woodstock products.
            </p>
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
                  Best selling Woodstock products will appear here once product
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
          <div className="mb-8">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              {BRAND_NAME}
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              Best Rated Products
            </h2>

            <p className="mt-3 text-sm md:text-base text-on-surface-variant">
              Explore the highest-rated Woodstock products.
            </p>
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
                  Best rated Woodstock products will appear here once product
                  ratings are available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          ALL WOODSTOCK PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-24">
        <div className="max-w-container-max mx-auto">
          <div className="mb-8">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              Our Collection
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              All Woodstock Products
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
                  local_bar
                </span>

                <h3 className="font-serif text-2xl text-on-surface mb-3">
                  Woodstock Products
                </h3>

                <p className="text-on-surface-variant leading-relaxed">
                  Woodstock products will appear here once they are available in
                  our collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
