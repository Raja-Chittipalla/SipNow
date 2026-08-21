import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/PageHero.jsx";
import {
  formatCartQuantity,
  formatCurrency,
  parsePrice,
} from "../utils/productHelpers.js";
import {
  formatAddress,
  persistAddresses,
  readSavedAddresses,
  upsertAddress,
} from "../utils/addressStorage.js";

/*
 * ============================================================
 * VALIDATION RULES
 * ============================================================
 */

/*
 * Name:
 * - Letters and spaces only
 * - Minimum 2 characters
 * - Maximum 50 characters
 */
const NAME_PATTERN = /^[A-Za-z][A-Za-z '-]{1,99}$/;
const ADDRESS_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s,./#-]{10,100}$/;
const AUSTRALIAN_MOBILE_PATTERN = /^4\d{8}$/;

const VALID_CITIES = [
  // New South Wales
  "Sydney",
  "Newcastle",
  "Wollongong",
  "Central Coast",
  "Wagga Wagga",
  "Albury",
  "Port Macquarie",
  "Coffs Harbour",
  "Tamworth",
  "Orange",
  "Dubbo",
  "Bathurst",
  "Nowra",
  "Goulburn",
  "Armidale",
  "Broken Hill",

  // Victoria
  "Melbourne",
  "Geelong",
  "Ballarat",
  "Bendigo",
  "Shepparton",
  "Mildura",
  "Warrnambool",
  "Traralgon",
  "Wodonga",
  "Sale",

  // Queensland
  "Brisbane",
  "Gold Coast",
  "Sunshine Coast",
  "Townsville",
  "Cairns",
  "Toowoomba",
  "Mackay",
  "Rockhampton",
  "Bundaberg",
  "Gladstone",
  "Hervey Bay",
  "Maryborough",

  // Western Australia
  "Perth",
  "Mandurah",
  "Bunbury",
  "Geraldton",
  "Albany",
  "Kalgoorlie",
  "Karratha",
  "Broome",
  "Port Hedland",

  // South Australia
  "Adelaide",
  "Mount Gambier",
  "Whyalla",
  "Murray Bridge",
  "Port Augusta",
  "Port Lincoln",

  // Tasmania
  "Hobart",
  "Launceston",
  "Devonport",
  "Burnie",

  // Australian Capital Territory
  "Canberra",

  // Northern Territory
  "Darwin",
  "Alice Springs",
  "Katherine",
];

const COUPONS = {
  SIPSAVE10: 10,
  SIPSAVE15: 15,
  SIPNOW25: 25,
};

// Registration stores an Australian mobile without +61 or the leading 0.
// Checkout accepts those common entry formats and persists the same canonical
// nine-digit value so a valid account mobile cannot be rejected at checkout.
function normalizeAustralianMobile(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^61/, "")
    .replace(/^0/, "")
    .slice(0, 9);
}

function readPreviousOrders() {
  try {
    const orders = JSON.parse(window.localStorage.getItem("sipnow-orders"));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

/*
 * ============================================================
 * CHECKOUT PAGE
 * ============================================================
 */

export default function Checkout({
  cartItems,
  user,
  onOrderComplete,
  onProfileSave,
}) {
  const navigate = useNavigate();
  /*
   * ==========================================================
   * FULFILMENT
   * ==========================================================
   */

  const [fulfilment, setFulfilment] = useState("delivery");

  /*
   * ==========================================================
   * COUPON / GIFT CARD
   * ==========================================================
   */

  const [couponCode, setCouponCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  /*
   * Message displayed after applying
   * coupon or gift card.
   */
  const [codeNotice, setCodeNotice] = useState("");

  const availableAddresses = readSavedAddresses(user);
  const [savedAddresses, setSavedAddresses] = useState(availableAddresses);
  const [addressMode, setAddressMode] = useState(
    availableAddresses.length ? "saved" : "new"
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    () =>
      availableAddresses.find((address) => address.isDefault)?.id ??
      availableAddresses[0]?.id ??
      ""
  );
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [newAddressLabel, setNewAddressLabel] = useState("");

  /*
   * ==========================================================
   * CHECKOUT FORM VALUES
   * ==========================================================
   */

  const [values, setValues] = useState(() => {
    const defaultAddress =
      availableAddresses.find((address) => address.isDefault) ??
      availableAddresses[0] ??
      {};
    return {
      name: user?.name ?? "",
      phone: normalizeAustralianMobile(user?.mobile),
      address: defaultAddress.address ?? "",
      city: defaultAddress.city ?? "",
    };
  });

  /*
   * ==========================================================
   * VALIDATION ERRORS
   * ==========================================================
   */

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  /*
   * ==========================================================
   * CALCULATE SUBTOTAL
   * ==========================================================
   */

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      parsePrice(item.product.price) * (item.packSize ?? 1) * item.quantity,
    0
  );

  /*
   * Calculate coupon discount.
   */
  const discount = (subtotal * couponDiscount) / 100;

  /*
   * Calculate final order total.
   */
  const total = subtotal - discount;

  /*
   * ==========================================================
   * SUBMIT CHECKOUT
   * ==========================================================
   */

  const submit = (event) => {
    /*
     * Prevent normal browser form submission.
     */
    event.preventDefault();

    const nextErrors = {};
    setSubmitError("");

    // A checkout must never create an order for an empty or malformed cart.
    const hasInvalidCartItem = cartItems.some(
      (item) =>
        !item?.product?.name ||
        parsePrice(item.product.price) <= 0 ||
        Number(item.quantity) <= 0 ||
        Number(item.packSize ?? 1) <= 0
    );
    if (!cartItems.length || hasInvalidCartItem) {
      setSubmitError(
        "Your cart needs a valid item before an order can be placed."
      );
      return;
    }

    /*
     * --------------------------------------------------------
     * NAME VALIDATION
     * --------------------------------------------------------
     */

    if (!NAME_PATTERN.test(values.name.trim())) {
      nextErrors.name = "Name can contain letters and spaces only.";
    }

    /*
     * --------------------------------------------------------
     * PHONE VALIDATION
     * --------------------------------------------------------
     *
     * The application uses Australian mobile numbers. Accept 4XXXXXXXX,
     * 04XXXXXXXX, and +614XXXXXXXX, then store 4XXXXXXXX consistently.
     */

    const phone = normalizeAustralianMobile(values.phone);
    if (!AUSTRALIAN_MOBILE_PATTERN.test(phone)) {
      nextErrors.phone =
        "Enter a valid Australian mobile number beginning with 4.";
    }

    /*
     * --------------------------------------------------------
     * DELIVERY ADDRESS
     * --------------------------------------------------------
     *
     * Address is only required for delivery.
     */

    const selectedAddress = savedAddresses.find(
      (address) => address.id === selectedAddressId
    );
    const enteredCity = values.city.trim();
    let deliveryAddress = null;

    if (fulfilment === "delivery" && addressMode === "saved") {
      if (!selectedAddress) {
        nextErrors.address = "Choose a saved address or add a new one.";
      } else {
        deliveryAddress = selectedAddress;
      }
    }

    if (fulfilment === "delivery" && addressMode === "new") {
      if (!ADDRESS_PATTERN.test(values.address.trim())) {
        nextErrors.address =
          "Enter a street address with a building or street number.";
      }
      if (
        !VALID_CITIES.some(
          (city) => city.toLowerCase() === enteredCity.toLowerCase()
        )
      ) {
        nextErrors.city = "Please select a valid delivery city.";
      }
      if (!nextErrors.address && !nextErrors.city) {
        deliveryAddress = {
          label: newAddressLabel.trim() || "Delivery address",
          address: values.address.trim(),
          city: enteredCity,
        };
      }
    }

    /*
     * Store validation errors.
     */
    setErrors(nextErrors);

    /*
     * If there are validation errors,
     * don't place the order.
     */
    if (Object.keys(nextErrors).length) return;

    if (fulfilment === "delivery" && addressMode === "new" && saveNewAddress) {
      const saved = upsertAddress(savedAddresses, {
        ...deliveryAddress,
        isDefault: savedAddresses.length === 0,
      });
      const nextAddresses = saved.addresses;
      persistAddresses(nextAddresses);
      setSavedAddresses(nextAddresses);
      onProfileSave({ addresses: nextAddresses });
      deliveryAddress = saved.address;
    }

    /*
     * ========================================================
     * CREATE ORDER
     * ========================================================
     */

    const order = {
      // FDD order history needs an identifier and status in addition to items.
      // Five digit identifiers are concise and remain stable in order history.
      orderNumber: `#${String(
        readPreviousOrders().reduce((highest, previous) => {
          const value = Number(
            String(previous.orderNumber ?? "").replace(/\D/g, "")
          );
          return Number.isFinite(value) ? Math.max(highest, value) : highest;
        }, 0) + 1
      )
        .padStart(5, "0")
        .slice(-5)}`,
      status: fulfilment === "delivery" ? "PAYMENT_PENDING" : "CREATED",
      cartItems,
      customer: {
        name: values.name.trim(),
        email: user?.email ?? "",
        mobile: phone,
      },
      deliveryAddress: fulfilment === "delivery" ? deliveryAddress : null,
      couponCode: couponCode.trim(),
      couponDiscount,
      discount,
      fulfilment,
      giftCardCode: giftCardCode.trim(),
      subtotal,
      total,
      placedAt: new Date().toISOString(),
    };

    /*
     * ========================================================
     * READ PREVIOUS ORDERS
     * ========================================================
     */

    try {
      const previousOrders = readPreviousOrders();

      /*
       * ========================================================
       * SAVE ORDER HISTORY
       * ========================================================
       *
       * `sipnow-orders` is the canonical local record consumed by the profile
       * page. Use one write before clearing the live cart: localStorage has
       * no transaction support, and a second duplicate write could otherwise
       * leave a partially saved order if storage fails mid-operation.
       */
      window.localStorage.setItem(
        "sipnow-orders",
        JSON.stringify([order, ...previousOrders])
      );
      /*
       * Notify App.jsx only after the complete order record is persisted.
       */
      onOrderComplete();
    } catch {
      setSubmitError(
        "We could not save your order. Your cart is still available—please try again."
      );
    }
  };

  /*
   * ==========================================================
   * INPUT STYLING
   * ==========================================================
   */

  const inputClass = (field) =>
    `w-full rounded-xl border bg-surface-container-high px-4 py-3 text-sm focus:ring-0 ${
      errors[field]
        ? "border-error"
        : "border-outline-variant/30 focus:border-primary"
    }`;

  /*
   * ==========================================================
   * UPDATE INPUT VALUES
   * ==========================================================
   */

  const update = (event) => {
    const { name, value } = event.target;

    let cleanedValue = value;

    if (name === "name") {
      cleanedValue = value.replace(/[^A-Za-z ]/g, "");
    }

    if (name === "phone") {
      cleanedValue = normalizeAustralianMobile(value);
    }

    if (name === "city") {
      cleanedValue = value.replace(/[^A-Za-z '-]/g, "");
    }

    /*
     * Address:
     * Keep normal address characters.
     */

    setValues((current) => ({
      ...current,
      [name]: cleanedValue,
    }));

    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }

    if (submitError) setSubmitError("");
  };

  const chooseSavedAddress = (address) => {
    setSelectedAddressId(address.id);
    setAddressMode("saved");
    setValues((current) => ({
      ...current,
      address: address.address,
      city: address.city,
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.address;
      delete next.city;
      return next;
    });
  };

  const beginNewAddress = () => {
    setAddressMode("new");
    setSelectedAddressId("");
    setValues((current) => ({ ...current, address: "", city: "" }));
    setErrors((current) => {
      const next = { ...current };
      delete next.address;
      delete next.city;
      return next;
    });
  };

  /*
   * ==========================================================
   * APPLY COUPON
   * ==========================================================
   */

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    /*
     * Empty coupon.
     */
    if (!code) {
      setCodeNotice("Please enter a coupon code.");
      setCouponDiscount(0);
      return;
    }

    /*
     * Coupon format validation.
     */
    if (!/^[A-Z0-9-]{3,20}$/.test(code)) {
      setCodeNotice("Enter a valid coupon code.");
      setCouponDiscount(0);
      return;
    }

    /*
     * Check whether the coupon exists.
     */
    if (!COUPONS[code]) {
      setCodeNotice("Invalid or expired coupon code.");
      setCouponDiscount(0);
      return;
    }

    /*
     * Apply coupon.
     */
    setCouponCode(code);
    setCouponDiscount(COUPONS[code]);
    setCodeNotice(`Coupon ${code} applied successfully.`);
  };

  /*
   * ==========================================================
   * APPLY GIFT CARD
   * ==========================================================
   */

  const applyGiftCard = () => {
    const code = giftCardCode.trim();

    /*
     * Empty gift card.
     */
    if (!code) {
      setCodeNotice("Enter a gift card code first.");
      return;
    }

    /*
     * For now, save the gift card code to the order.
     */
    setCodeNotice("Gift card saved for this order.");
  };

  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <div className="pt-32 lg:pt-36 pb-24">
      {/* Back to Home */}
      <Reveal>
        <PageHero
          onBack={() => navigate("/cart")}
          backLabel="Back to cart"
          tag="Shopping"
        />
      </Reveal>

      <Reveal className="mx-auto mt-8 grid max-w-5xl gap-8 px-margin-mobile md:grid-cols-[minmax(0,1fr)_19rem] md:px-margin-desktop">
        <form
          className="glass-panel rounded-2xl p-5 sm:p-8"
          noValidate
          onSubmit={submit}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-headline-md text-2xl uppercase tracking-[0.12em]">
              Order summary
            </h1>
          </div>

          {/* ====================================================
              CART ITEMS
              ==================================================== */}

          <div className="mt-3">
            {cartItems.map(({ product, quantity, packSize = 1 }) => (
              <div
                className="flex items-center gap-3 border-b border-primary/10 py-3 last:border-0"
                key={`${product.name}-${packSize}`}
              >
                <img
                  alt=""
                  className="h-12 w-12 rounded-md bg-surface-container-high object-contain"
                  src={product.image}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>

                  <p className="text-xs text-on-surface-variant">
                    {product.category} ·{" "}
                    {formatCartQuantity(quantity, packSize)}
                  </p>
                </div>

                <p className="font-headline-md text-primary">
                  {formatCurrency(
                    parsePrice(product.price) * packSize * quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* ====================================================
              COUPON AND GIFT CARD
              ==================================================== */}

          <div className="mt-5 space-y-3 border-t border-primary/10 pt-5">
            {/* Coupon */}
            <div className="flex gap-2">
              <input
                aria-label="Coupon code"
                className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-0"
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="COUPON CODE"
                value={couponCode}
              />

              <button
                className="rounded-full px-5 text-sm text-white primary-gradient"
                onClick={applyCoupon}
                type="button"
              >
                Apply
              </button>
            </div>

            {/* Gift card */}
            <div className="flex gap-2">
              <input
                aria-label="Gift card code"
                className="min-w-0 flex-1 rounded-full border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-0"
                onChange={(event) => setGiftCardCode(event.target.value)}
                placeholder="GIFT CARD CODE"
                value={giftCardCode}
              />

              <button
                className="rounded-full px-5 text-sm text-white primary-gradient"
                onClick={applyGiftCard}
                type="button"
              >
                Apply
              </button>
            </div>

            {codeNotice && <p className="text-xs text-primary">{codeNotice}</p>}
          </div>

          {/* ====================================================
              CONTACT DETAILS
              ==================================================== */}

          <div className="mt-6 border-t border-primary/10 pt-6">
            <h2 className="font-headline-md text-lg uppercase tracking-[0.12em]">
              Contact details
            </h2>

            <p className="mt-2 text-sm text-on-surface-variant">
              Logged in as {user?.email}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Full name */}
              <label>
                <span className="mb-2 block text-sm">Full name</span>

                <input
                  className={inputClass("name")}
                  name="name"
                  onChange={update}
                  value={values.name}
                />

                {errors.name && (
                  <span className="text-xs text-error">{errors.name}</span>
                )}
              </label>

              {/* Mobile */}
              <label>
                <span className="mb-2 block text-sm">Mobile number</span>

                <input
                  aria-describedby="checkout-phone-format"
                  className={inputClass("phone")}
                  inputMode="numeric"
                  maxLength={9}
                  name="phone"
                  onChange={update}
                  pattern="[0-9]*"
                  placeholder="4XX XXX XXX"
                  value={values.phone}
                />

                {errors.phone && (
                  <span className="text-xs text-error">{errors.phone}</span>
                )}
              </label>
            </div>

            {fulfilment === "delivery" && (
              <div className="mt-6 border-t border-primary/10 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-headline-md text-lg uppercase tracking-[0.12em]">
                      Delivery address
                    </h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Select a saved address or add a new delivery location.
                    </p>
                  </div>
                  {savedAddresses.length > 0 && addressMode === "saved" && (
                    <button
                      className="rounded-lg border border-primary/30 px-3 py-2 text-sm text-primary hover:border-primary"
                      onClick={beginNewAddress}
                      type="button"
                    >
                      Add new address
                    </button>
                  )}
                </div>

                {savedAddresses.length > 0 && addressMode === "saved" && (
                  <div className="mt-4 space-y-3">
                    {savedAddresses.map((address) => (
                      <button
                        aria-pressed={selectedAddressId === address.id}
                        className={`w-full rounded-xl border p-4 text-left transition-colors ${
                          selectedAddressId === address.id
                            ? "border-primary bg-primary/10"
                            : "border-outline-variant/30 hover:border-primary/50"
                        }`}
                        key={address.id}
                        onClick={() => chooseSavedAddress(address)}
                        type="button"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span>
                            <span className="flex flex-wrap items-center gap-2 font-medium">
                              {address.label}
                              {address.isDefault && (
                                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                                  Default
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block text-sm text-on-surface-variant">
                              {formatAddress(address)}
                            </span>
                          </span>
                          <span className="material-symbols-outlined text-primary">
                            {selectedAddressId === address.id
                              ? "radio_button_checked"
                              : "radio_button_unchecked"}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {addressMode === "new" && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="mb-2 block text-sm">
                        Address label (optional)
                      </span>
                      <input
                        className={inputClass("addressLabel")}
                        onChange={(event) =>
                          setNewAddressLabel(event.target.value)
                        }
                        placeholder="Home, Work, etc."
                        value={newAddressLabel}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm">City</span>
                      <select
                        className={inputClass("city")}
                        name="city"
                        onChange={update}
                        value={values.city}
                      >
                        <option value="">Select delivery city</option>
                        {VALID_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <span className="text-xs text-error">
                          {errors.city}
                        </span>
                      )}
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-2 block text-sm">Street address</span>
                      <input
                        className={inputClass("address")}
                        name="address"
                        onChange={update}
                        placeholder="123 George Street"
                        value={values.address}
                      />
                      {errors.address && (
                        <span className="text-xs text-error">
                          {errors.address}
                        </span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 text-sm sm:col-span-2">
                      <input
                        checked={saveNewAddress}
                        className="rounded border-primary/40 bg-surface-container-high text-primary focus:ring-primary"
                        onChange={(event) =>
                          setSaveNewAddress(event.target.checked)
                        }
                        type="checkbox"
                      />
                      Save this address to my profile
                    </label>
                    {savedAddresses.length > 0 && (
                      <button
                        className="w-fit text-sm text-primary hover:underline sm:col-span-2"
                        onClick={() =>
                          chooseSavedAddress(
                            savedAddresses.find(
                              (address) => address.isDefault
                            ) ?? savedAddresses[0]
                          )
                        }
                        type="button"
                      >
                        Back to saved addresses
                      </button>
                    )}
                  </div>
                )}
                {addressMode === "saved" && errors.address && (
                  <span className="mt-2 block text-xs text-error">
                    {errors.address}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ====================================================
              PLACE ORDER
              ==================================================== */}

          {submitError && (
            <p className="mt-5 text-sm text-error" role="alert">
              {submitError}
            </p>
          )}

          <button
            className="mt-7 w-full rounded-lg py-3 text-sm uppercase tracking-widest text-white primary-gradient"
            type="submit"
          >
            Place order
          </button>
        </form>

        {/* ====================================================
            FULFILMENT / ORDER TOTAL
            ==================================================== */}

        <aside className="glass-panel h-fit rounded-2xl p-5 sm:p-6">
          <h2 className="font-headline-md text-lg uppercase tracking-[0.12em]">
            How would you like your order?
          </h2>

          {/* Fulfilment */}
          <div className="mt-5 space-y-3">
            {[
              ["delivery", "local_shipping", "Delivery", "Paid by card"],
              ["pickup", "storefront", "Pickup", "Pay cash or card in store"],
            ].map(([value, icon, title, text]) => (
              <button
                aria-pressed={fulfilment === value}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${
                  fulfilment === value
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/30"
                }`}
                key={value}
                onClick={() => setFulfilment(value)}
                type="button"
              >
                <span className="material-symbols-outlined text-primary">
                  {icon}
                </span>

                <span>
                  <span className="block font-medium">{title}</span>

                  <span className="block text-xs text-on-surface-variant">
                    {text}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* ====================================================
              ORDER TOTALS
              ==================================================== */}

          <div className="mt-6 space-y-3 border-t border-primary/10 pt-5 text-sm">
            {/* Subtotal */}
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>

              <span>{formatCurrency(subtotal)}</span>
            </div>

            {/* Discount */}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Discount ({couponDiscount}%)</span>

                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex justify-between text-on-surface-variant">
              <span>Delivery</span>

              <span>
                {fulfilment === "delivery" ? "To be confirmed" : "Free"}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between border-t border-primary/10 pt-3 font-headline-md text-lg">
              <span>Total</span>

              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </aside>
      </Reveal>
    </div>
  );
}
