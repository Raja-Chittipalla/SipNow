import { WishlistContext } from "../context/wishlistContextStore.js";

export function WishlistProvider({
  wishlistItems,
  wishlistNotice,
  isWishlisted,
  toggleWishlist,
  children,
}) {
  return (
    <WishlistContext.Provider
      value={{ wishlistItems, wishlistNotice, isWishlisted, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
