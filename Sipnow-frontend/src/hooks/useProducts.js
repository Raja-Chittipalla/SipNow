import { useEffect, useState } from "react";
import { apiGet, resolveImageUrl } from "../utils/api.js";

function adaptProduct(product) {
  return {
    ...product,
    price: `$${Number(product.price).toFixed(2)}`,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    image: resolveImageUrl(product.image),
  };
}

/** Product catalog is fetched live from the backend API. */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiGet("/products?limit=1000")
      .then((data) => {
        if (cancelled) return;
        setProducts((data.items || []).map(adaptProduct));
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
  }, []);

  return { products, loading, error };
}
