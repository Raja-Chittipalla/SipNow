import { useMemo } from "react";
import ProductGrid from "./ProductGrid.jsx";
import { useAddToCartFeedback } from "../hooks/useAddToCartFeedback.js";

function EmptyCollection({ title, icon }) {
  return (
    <div className="glass-panel rounded-xl border border-primary/10 min-h-[240px] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <span className="material-symbols-outlined text-5xl text-primary/40 mb-4">
          {icon}
        </span>
        <h3 className="font-serif text-2xl text-on-surface mb-3">{title}</h3>
        <p className="text-on-surface-variant leading-relaxed">
          {title} will appear here once products are available.
        </p>
      </div>
    </div>
  );
}

function ProductSection({
  addedProduct,
  description,
  handleAddToCart,
  icon,
  label,
  products,
  title,
}) {
  return (
    <section className="px-margin-mobile md:px-margin-desktop pb-20">
      <div className="max-w-container-max mx-auto">
        <div className="mb-8">
          <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-3">
            {label}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface">
            {title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-on-surface-variant">
            {description}
          </p>
        </div>
        {products.length > 0 ? (
          <ProductGrid
            addedProduct={addedProduct}
            onAddToCart={handleAddToCart}
            products={products}
            emptyMessage=""
          />
        ) : (
          <EmptyCollection icon={icon} title={title} />
        )}
      </div>
    </section>
  );
}

export default function BrandCollection({
  brandName,
  description,
  onAddToCart,
  products = [],
  productsLoading = false,
  keywords = [],
}) {
  const { addedProduct, handleAddToCart } = useAddToCartFeedback(onAddToCart);
  const brandProducts = useMemo(() => {
    const terms = keywords.map((keyword) => keyword.toLowerCase());
    return products.filter((product) => {
      const text =
        `${product.brand || ""} ${product.brandName || ""} ${product.manufacturer || ""} ${product.name || ""}`.toLowerCase();
      return terms.some((term) => text.includes(term));
    });
  }, [keywords, products]);

  const bestSellingProducts = [...brandProducts]
    .sort(
      (a, b) =>
        Number(b.salesCount || b.soldCount || b.unitsSold || 0) -
        Number(a.salesCount || a.soldCount || a.unitsSold || 0)
    )
    .slice(0, 6);
  const bestRatedProducts = [...brandProducts]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-container-max mx-auto">
          <div className="max-w-4xl">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.25em] mb-5">
              About the Brand
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-on-surface">
              {brandName} Collection
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-on-surface-variant">
              {description}
            </p>
          </div>
        </div>
      </section>

      {productsLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-on-surface-variant">Loading products...</p>
        </div>
      ) : (
        <>
          <ProductSection
            addedProduct={addedProduct}
            description={`Discover the most popular ${brandName} products.`}
            handleAddToCart={handleAddToCart}
            icon="trending_up"
            label={brandName}
            products={bestSellingProducts}
            title="Best Selling Products"
          />
          <ProductSection
            addedProduct={addedProduct}
            description={`Explore the highest-rated ${brandName} products.`}
            handleAddToCart={handleAddToCart}
            icon="star"
            label={brandName}
            products={bestRatedProducts}
            title="Best Rated Products"
          />
          <ProductSection
            addedProduct={addedProduct}
            description={`Browse all ${brandName} products in our collection.`}
            handleAddToCart={handleAddToCart}
            icon="liquor"
            label="Our Collection"
            products={brandProducts}
            title={`All ${brandName} Products`}
          />
        </>
      )}
    </div>
  );
}
