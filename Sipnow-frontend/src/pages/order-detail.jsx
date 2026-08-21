import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/PageHero.jsx";
import { formatAddress } from "../utils/addressStorage.js";
import {
  formatCartQuantity,
  formatCurrency,
  parsePrice,
} from "../utils/productHelpers.js";

function readOrder(orderNumber, user) {
  try {
    const orders = JSON.parse(window.localStorage.getItem("sipnow-orders"));

    return Array.isArray(orders)
      ? orders.find(
          (order) =>
            order.orderNumber === orderNumber &&
            order.customer?.email?.toLowerCase() === user?.email?.toLowerCase()
        )
      : null;
  } catch {
    return null;
  }
}

function formatOrderId(orderNumber) {
  if (String(orderNumber ?? "").startsWith("#")) return orderNumber;
  const digits = String(orderNumber ?? "")
    .replace(/\D/g, "")
    .slice(-5);
  return digits ? `#${digits.padStart(5, "0")}` : "#00000";
}

export default function OrderDetail({ user }) {
  const navigate = useNavigate();
  const { orderNumber } = useParams();

  const [order, setOrder] = useState(() => readOrder(orderNumber, user));
  const [notice, setNotice] = useState("");

  if (!order) {
    return (
      <div className="pt-36 pb-24 sm:pt-40 lg:pt-44">
        <PageHero
          onBack={() => navigate("/order-history")}
          backLabel="Back to order history"
          tag="Order details"
        />

        <Reveal>
          <main className="mx-auto mt-10 max-w-7xl px-margin-mobile md:px-margin-desktop">
            <section className="glass-panel rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-primary">
                receipt_long
              </span>

              <h1 className="mt-4 font-headline-md text-3xl">
                Order not found
              </h1>

              <p className="mt-3 text-on-surface-variant">
                This order is unavailable in local order history.
              </p>
            </section>
          </main>
        </Reveal>
      </div>
    );
  }

  const address = formatAddress(order.deliveryAddress);
  const cancelOrder = () => {
    if (order.status === "CANCELLED") return;
    const orders = JSON.parse(
      window.localStorage.getItem("sipnow-orders") ?? "[]"
    );
    window.localStorage.setItem(
      "sipnow-orders",
      JSON.stringify(
        orders.map((item) =>
          item.orderNumber === order.orderNumber
            ? { ...item, status: "CANCELLED" }
            : item
        )
      )
    );
    setOrder((current) => ({ ...current, status: "CANCELLED" }));
    setNotice(`Order ${formatOrderId(order.orderNumber)} has been cancelled.`);
  };

  return (
    <div className="pt-36 pb-24 sm:pt-40 lg:pt-44">
      <PageHero
        onBack={() => navigate("/order-history")}
        backLabel="Back to order history"
        tag="Order details"
      />

      <Reveal>
        <main className="mx-auto mt-10 max-w-[1320px] px-margin-mobile md:px-margin-desktop">
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            {/* ORDER HEADER */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                  Order details
                </p>

                <h1 className="mt-3 font-headline-md text-3xl">
                  Order ID: {formatOrderId(order.orderNumber)}
                </h1>

                <p className="mt-2 text-sm text-on-surface-variant">
                  Placed {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>

              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm text-primary">
                {order.status?.replaceAll("_", " ") ?? "Created"}
              </span>
            </div>
            {notice && (
              <div
                className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
                role="status"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                {notice}
              </div>
            )}
            {order.status !== "CANCELLED" && (
              <button
                className="mt-5 rounded-lg border border-error/40 px-4 py-2 text-sm text-error hover:bg-error/10"
                onClick={cancelOrder}
                type="button"
              >
                Cancel order
              </button>
            )}

            {/* ORDER INFORMATION */}
            <div className="mt-6 grid gap-4 border-t border-primary/10 pt-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">
                  Fulfilment
                </p>

                <p className="mt-1 capitalize">{order.fulfilment}</p>
              </div>

              {address && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-on-surface-variant">
                    Delivery address
                  </p>

                  <p className="mt-1">{address}</p>
                </div>
              )}
            </div>

            {/* ITEMS */}
            <div className="mt-6 border-t border-primary/10 pt-6">
              <h2 className="font-headline-md text-xl">Items</h2>

              <div className="mt-3 space-y-3">
                {order.cartItems.map((item) => (
                  <div
                    className="flex items-center gap-3"
                    key={`${item.product.name}-${item.packSize ?? 1}`}
                  >
                    <img
                      alt=""
                      className="h-12 w-12 rounded-md bg-surface-container-high object-contain"
                      src={item.product.image}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-on-surface-variant">
                        {formatCartQuantity(item.quantity, item.packSize ?? 1)}
                      </p>
                    </div>

                    <p>
                      {formatCurrency(
                        parsePrice(item.product.price) *
                          item.quantity *
                          (item.packSize ?? 1)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-6 space-y-2 border-t border-primary/10 pt-5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>

                <span>{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-on-surface-variant">
                  <span>Discount</span>

                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-primary/10 pt-3 font-headline-md text-lg">
                <span>Total</span>

                <span className="text-primary">
                  {formatCurrency(order.total ?? order.subtotal)}
                </span>
              </div>
            </div>
          </section>
        </main>
      </Reveal>
    </div>
  );
}
