import { createContext } from "react";

// Exposes the live cart line items app-wide so any product picker can read
// what's already been added (to pre-fill quantities and reflect "Added to
// Cart" state) without cartItems having to be prop-drilled through every
// route and page that renders a ProductCard.
export const CartContext = createContext([]);
