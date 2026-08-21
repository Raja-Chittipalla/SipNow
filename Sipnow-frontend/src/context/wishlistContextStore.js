import { createContext } from "react";

// Exposes the live wishlist app-wide so any ProductCard can read/toggle a
// product's wishlisted state and the wishlist page can list them, without
// prop-drilling through every route and page that renders a ProductCard.
export const WishlistContext = createContext({
  wishlistItems: [],
  wishlistNotice: null,
  isWishlisted: () => false,
  toggleWishlist: () => {},
});
