import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { formatCurrency } from "../utils/productHelpers.js";

function formatOrderId(orderNumber) {
  if (String(orderNumber ?? "").startsWith("#")) return orderNumber;
  const digits = String(orderNumber ?? "")
    .replace(/\D/g, "")
    .slice(-5);
  return digits ? `#${digits.padStart(5, "0")}` : "#00000";
}

function readOrders(user) {
  try {
    const orders = JSON.parse(window.localStorage.getItem("sipnow-orders"));
    return Array.isArray(orders)
      ? orders.filter(
          (order) =>
            order.customer?.email?.toLowerCase() === user.email?.toLowerCase()
        )
      : [];
  } catch {
    return [];
  }
}

export default function OrderHistory({ user }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => readOrders(user));
  const [notice, setNotice] = useState("");

  const cancelOrder = (orderNumber) => {
    const update = (order) =>
      order.orderNumber === orderNumber
        ? { ...order, status: "CANCELLED" }
        : order;
    const allOrders = JSON.parse(
      window.localStorage.getItem("sipnow-orders") ?? "[]"
    );
    window.localStorage.setItem(
      "sipnow-orders",
      JSON.stringify(allOrders.map(update))
    );
    setOrders((current) => current.map(update));
    setNotice(`Order ${formatOrderId(orderNumber)} has been cancelled.`);
  };

  return (
    <div className="pt-36 pb-24 sm:pt-40 lg:pt-44">
      <PageHero
        backLabel="Back to profile"
        onBack={() => navigate("/profile")}
        tag="Orders"
        title="Order History"
      />
      <Reveal className="mx-auto mt-8 max-w-7xl px-margin-mobile md:px-margin-desktop">
        <section className="glass-panel rounded-2xl p-5 sm:p-8">
          {notice && (
            <div
              className="mb-5 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
              role="status"
            >
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              {notice}
            </div>
          )}
          {orders.length ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const cancelled = order.status === "CANCELLED";
                return (
                  <article
                    className="rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40 sm:p-5"
                    key={`${order.orderNumber}-${order.placedAt}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                          Order ID
                        </p>
                        <p className="mt-1 font-headline-md text-xl text-primary">
                          Order ID: {formatOrderId(order.orderNumber)}
                        </p>
                        <p className="mt-2 text-sm text-on-surface-variant">
                          {new Date(order.placedAt).toLocaleString()} ·{" "}
                          {order.fulfilment === "delivery"
                            ? "Delivery"
                            : "Pickup"}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${cancelled ? "border-error/30 bg-error/10 text-error" : "border-primary/30 bg-primary/10 text-primary"}`}
                      >
                        {cancelled
                          ? "Order cancelled"
                          : (order.status?.replaceAll("_", " ") ?? "Created")}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 border-t border-primary/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium">
                        Total{" "}
                        <span className="ml-2 text-primary">
                          {formatCurrency(order.total ?? order.subtotal)}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          className="rounded-lg border border-primary/30 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
                          to={`/orders/${encodeURIComponent(order.orderNumber)}`}
                        >
                          View order details
                        </Link>
                        {!cancelled && (
                          <button
                            className="rounded-lg border border-error/30 px-4 py-2 text-sm text-error transition-colors hover:bg-error/10"
                            onClick={() => cancelOrder(order.orderNumber)}
                            type="button"
                          >
                            Cancel order
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-on-surface-variant">
              You have not placed an order yet.
            </div>
          )}
        </section>
      </Reveal>
    </div>
  );
}
