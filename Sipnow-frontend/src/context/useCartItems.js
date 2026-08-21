import { useContext } from "react";
import { CartContext } from "./cartContextStore.js";

export function useCartItems() {
  const cart = useContext(CartContext);

  // Keep the array fallback so this hook remains safe if a card is rendered
  // outside CartProvider in future previews or isolated component tests.
  return Array.isArray(cart) ? cart : (cart.items ?? []);
}

/** Returns the exact-quantity cart updater exposed by CartProvider. */
export function useCartSelectionUpdater() {
  const cart = useContext(CartContext);
  return Array.isArray(cart) ? undefined : cart.updateSelections;
}
