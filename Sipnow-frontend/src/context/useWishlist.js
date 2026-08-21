import { useContext } from "react";
import { WishlistContext } from "./wishlistContextStore.js";

export function useWishlist() {
  return useContext(WishlistContext);
}
