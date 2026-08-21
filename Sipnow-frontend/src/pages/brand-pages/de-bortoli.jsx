import { useMemo } from "react";
import ProductGrid from "../../components/ProductGrid.jsx";
import { useAddToCartFeedback } from "../../hooks/useAddToCartFeedback.js";
import deBortoliBanner from "../../assets/brandimages/de-bortoil-banner.jpg";

const BRAND_NAME = "De Bortoli";

export default function DeBortoli({
  products = [],
  productsLoading = false,
  onAddToCart,
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);

  /*
   * ============================================================
   * DE BORTOLI PRODUCTS
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
        brand === "de bortoli" ||
        brand === "debortoli" ||
        brand === "de-bortoli" ||
        name.includes("de bortoli") ||
        name.includes("debortoli")
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
          DE BORTOLI BRAND BANNER
          IMAGE ONLY
      ======================================================== */}

      <section className="w-full overflow-hidden pt-[115px]">
        <img
          src={deBortoliBanner}
          alt="De Bortoli"
          className="block w-full h-auto object-contain"
        />
      </section>

      {/* ========================================================
          ABOUT THE BRAND
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-container-max mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {" "}
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-5">
              About the Brand
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-on-surface">
              De Bortoli Collection
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-on-surface-variant">
              Explor the De Bortoli collection and discover wines crafted with
              generations of Australian winemaking experience. Browse
              Chardonnay, Shiraz, Cabernet Sauvignon and more.
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
              De Bortoli
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              Best Selling Products
            </h2>

            <p className="mt-3 text-sm md:text-base text-on-surface-variant">
              Explore our best-selling De Bortoli wines.
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
                  Best-selling De Bortoli products will appear here once sales
                  data is available.
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
              De Bortoli
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              Best Rated Products
            </h2>

            <p className="mt-3 text-sm md:text-base text-on-surface-variant">
              Explore our highest-rated De Bortoli wines.
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
                  Best-rated De Bortoli products will appear here once product
                  ratings are available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          ALL DE BORTOLI PRODUCTS
      ======================================================== */}

      <section className="px-margin-mobile md:px-margin-desktop pb-24">
        <div className="max-w-container-max mx-auto">
          <div className="mb-8">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
              Our Collection
            </p>

            <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
              All De Bortoli Products
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
                  De Bortoli Products
                </h3>

                <p className="text-on-surface-variant leading-relaxed">
                  De Bortoli products will appear here once they are available
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
