import { CartContext } from "../context/cartContextStore.js";

// Cart pages and product cards use this shared value so a product picker can
// replace an existing selection (for example, 3 items becomes 2) without
// relying on an add-only cart callback.
export function CartProvider({ cartItems, onUpdateSelections, children }) {
  return (
    <CartContext.Provider
      value={{ items: cartItems, updateSelections: onUpdateSelections }}
    >
      {children}
    </CartContext.Provider>
  );
}
