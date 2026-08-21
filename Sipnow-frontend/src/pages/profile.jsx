import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/useWishlist.js";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/PageHero.jsx";
import { formatCurrency, parsePrice } from "../utils/productHelpers.js";
import {
  formatAddress,
  persistAddresses,
  readSavedAddresses,
  setDefaultAddress,
  upsertAddress,
} from "../utils/addressStorage.js";
import {
  AUSTRALIAN_MOBILE_PATTERN,
  NAME_PART_PATTERN,
} from "../utils/validation.js";
import { validateEmail } from "../utils/emailValidation.js";

const ADDRESS_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9\s,./#-]{10,100}$/;

/* Australian city validation */
const VALID_AUSTRALIAN_CITIES = [
  "Adelaide",
  "Albury",
  "Alice Springs",
  "Ballarat",
  "Bendigo",
  "Brisbane",
  "Broome",
  "Bundaberg",
  "Bunbury",
  "Cairns",
  "Canberra",
  "Coffs Harbour",
  "Darwin",
  "Devonport",
  "Geelong",
  "Geraldton",
  "Gladstone",
  "Gold Coast",
  "Hobart",
  "Launceston",
  "Mackay",
  "Melbourne",
  "Mildura",
  "Mount Gambier",
  "Newcastle",
  "Perth",
  "Port Macquarie",
  "Rockhampton",
  "Shepparton",
  "Sydney",
  "Toowoomba",
  "Townsville",
  "Wagga Wagga",
  "Whyalla",
  "Wollongong",
];

function normalizeCity(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isValidAustralianCity(value) {
  const normalizedCity = normalizeCity(value);

  return VALID_AUSTRALIAN_CITIES.some(
    (city) => normalizeCity(city) === normalizedCity
  );
}

function normalizeMobile(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^61/, "")
    .replace(/^0/, "")
    .slice(0, 9);
}

function getProfileValues(user) {
  const nameParts = (user?.name ?? "").trim().split(/\s+/).filter(Boolean);

  return {
    firstName: user?.firstName ?? nameParts[0] ?? "",
    lastName: user?.lastName ?? nameParts.slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    mobile: normalizeMobile(user?.mobile),
  };
}

function SavedAddressCard({ address, onDelete, onEdit, onSetDefault }) {
  return (
    <article className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{address.label}</h3>

            {address.isDefault && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                Default
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            {formatAddress(address)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <button
            className="text-primary transition-colors hover:text-primary/70 hover:underline"
            onClick={onEdit}
            type="button"
          >
            Edit
          </button>

          {!address.isDefault && (
            <button
              className="text-primary transition-colors hover:text-primary/70 hover:underline"
              onClick={onSetDefault}
              type="button"
            >
              Set default
            </button>
          )}

          <button
            className="text-error transition-colors hover:underline"
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Profile({ onLogout, onSave, onBack, user }) {
  const navigate = useNavigate();

  const { toggleWishlist, wishlistItems, wishlistNotice } = useWishlist();

  const [addresses, setAddresses] = useState(() => readSavedAddresses(user));

  const [values, setValues] = useState(() => getProfileValues(user, addresses));

  const [editing, setEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [profileNotice, setProfileNotice] = useState(null);
  const [addressEditor, setAddressEditor] = useState(null);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (!profileNotice) return undefined;

    const timer = window.setTimeout(() => {
      setProfileNotice(null);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [profileNotice]);

  const saveAddressCollection = (nextAddresses) => {
    persistAddresses(nextAddresses);
    setAddresses(nextAddresses);

    onSave({
      addresses: nextAddresses,
    });
  };

  const update = (event) => {
    const { name, value } = event.target;

    let cleanedValue = value;

    if (name === "firstName" || name === "lastName") {
      cleanedValue = value.replace(/[^A-Za-z '-]/g, "");
    }

    if (name === "mobile") {
      cleanedValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setValues((current) => ({
      ...current,
      [name]: cleanedValue,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (profileNotice) {
      setProfileNotice(null);
    }
  };

  /* =========================
     SAVE PROFILE
     ========================= */

  const saveProfile = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!NAME_PART_PATTERN.test(values.firstName.trim())) {
      nextErrors.firstName = "Enter a valid first name.";
    }

    if (!NAME_PART_PATTERN.test(values.lastName.trim())) {
      nextErrors.lastName = "Enter a valid last name.";
    }

    const emailError = validateEmail(values.email);

    if (emailError) {
      nextErrors.email = emailError;
    }

    if (!AUSTRALIAN_MOBILE_PATTERN.test(values.mobile)) {
      nextErrors.mobile =
        "Enter a valid Australian mobile number beginning with 4.";
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    const savedValues = getProfileValues(user, addresses);

    const nameChanged =
      values.firstName.trim() !== savedValues.firstName ||
      values.lastName.trim() !== savedValues.lastName;

    const mobileChanged = values.mobile !== savedValues.mobile;

    const emailChanged =
      values.email.trim().toLowerCase() !== savedValues.email.toLowerCase();

    const hasChanges = nameChanged || mobileChanged || emailChanged;

    if (!hasChanges) {
      setProfileNotice({
        tone: "info",
        text: "Please make changes before saving.",
      });

      return;
    }

    /*
     * Address is deliberately not changed here.
     * Address management is handled separately.
     */
    const updatedUser = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      email: values.email.trim().toLowerCase(),
      mobile: values.mobile,
      addresses,
    };

    onSave(updatedUser);

    setFieldErrors({});

    setProfileNotice({
      tone: "success",
      text: "Profile updated successfully.",
    });

    setEditing(false);
  };

  /* =========================
     ADDRESS EDITOR
     ========================= */

  const openAddressEditor = (address = null) => {
    setAddressError("");

    setAddressEditor(
      address
        ? { ...address }
        : {
            id: null,
            label: "",
            address: "",
            city: "",
            isDefault: addresses.length === 0,
          }
    );
  };

  const saveAddress = (event) => {
    event.preventDefault();

    if (!ADDRESS_PATTERN.test(addressEditor.address.trim())) {
      setAddressError(
        "Enter a street address with a building or street number."
      );

      return;
    }

    if (!isValidAustralianCity(addressEditor.city)) {
      setAddressError("Please enter a valid Australian city or locality.");

      return;
    }

    const cleanedAddress = {
      ...addressEditor,
      label: addressEditor.label.trim() || `Address ${addresses.length + 1}`,
      address: addressEditor.address.trim(),
      city: addressEditor.city.trim(),
    };

    let nextAddresses;

    if (cleanedAddress.id) {
      nextAddresses = addresses.map((address) =>
        address.id === cleanedAddress.id ? cleanedAddress : address
      );
    } else {
      const added = upsertAddress(addresses, cleanedAddress);

      nextAddresses = added.addresses;
      cleanedAddress.id = added.address.id;
    }

    if (
      cleanedAddress.isDefault ||
      !nextAddresses.some((address) => address.isDefault)
    ) {
      nextAddresses = setDefaultAddress(nextAddresses, cleanedAddress.id);
    }

    saveAddressCollection(nextAddresses);
    setAddressEditor(null);

    setProfileNotice({
      tone: "success",
      text: "Address changes saved successfully.",
    });
  };

  const deleteAddress = (addressId) => {
    let nextAddresses = addresses.filter((address) => address.id !== addressId);

    if (
      nextAddresses.length &&
      !nextAddresses.some((address) => address.isDefault)
    ) {
      nextAddresses = setDefaultAddress(nextAddresses, nextAddresses[0].id);
    }

    saveAddressCollection(nextAddresses);

    setProfileNotice({
      tone: "success",
      text: "Address deleted successfully.",
    });
  };

  /*
   * ONLY THESE FOUR FIELDS ARE SHOWN
   * IN EDIT PROFILE.
   */
  const fields = [
    ["firstName", "First name", "text"],
    ["lastName", "Last name", "text"],
    ["mobile", "Mobile", "tel"],
    ["email", "Email", "email"],
  ];

  return (
    <div className="pt-28 pb-24 sm:pt-32 lg:pt-36">
      <PageHero onBack={onBack ?? (() => navigate("/"))} tag="Shopping" />

      <Reveal>
        <main className="mx-auto mt-8 max-w-7xl px-margin-mobile md:px-margin-desktop">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#1d1b1f] shadow-2xl shadow-black/20">
            {/* =========================
                PROFILE HEADER
            ========================= */}

            <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 shadow-lg shadow-primary/10">
                    <span className="material-symbols-outlined text-[34px] text-primary">
                      account_circle
                    </span>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        My account
                      </span>
                    </div>

                    <h1 className="font-headline-md text-3xl leading-tight text-white sm:text-4xl">
                      Welcome, {user?.firstName || user?.name}
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      Manage your personal details and account information.
                    </p>
                  </div>
                </div>

                <div className="flex w-full gap-3 sm:w-auto">
                  <button
                    className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 sm:flex-none"
                    onClick={() => {
                      if (editing) {
                        setValues(getProfileValues(user, addresses));

                        setFieldErrors({});
                        setProfileNotice(null);
                      }

                      setEditing((value) => !value);
                    }}
                    type="button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        {editing ? "close" : "edit"}
                      </span>

                      {editing ? "Cancel" : "Edit profile"}
                    </span>
                  </button>

                  <button
                    className="flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white primary-gradient shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/30 sm:flex-none"
                    onClick={onLogout}
                    type="button"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* =========================
                PERSONAL INFORMATION
            ========================= */}

            {editing ? (
              <form
                className="bg-[#19181b] p-6 sm:p-8 lg:p-10"
                noValidate
                onSubmit={saveProfile}
              >
                <div className="mb-7">
                  <h2 className="font-headline-md text-2xl text-white sm:text-3xl">
                    Personal information
                  </h2>

                  <div className="mt-3 h-1 w-10 rounded-full bg-primary" />

                  <p className="mt-4 text-sm text-on-surface-variant">
                    Keep your personal and contact details up to date.
                  </p>
                </div>

                {/* EDIT PROFILE - 2 COLUMNS */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map(([name, label, type]) => (
                    <label key={name}>
                      <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                        {label}
                        <span className="ml-1 text-primary">*</span>
                      </span>

                      <input
                        autoComplete={
                          name === "firstName"
                            ? "given-name"
                            : name === "lastName"
                              ? "family-name"
                              : name
                        }
                        className={`w-full rounded-xl border bg-[#242326] px-4 py-3.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 ${
                          fieldErrors[name]
                            ? "border-error/70 focus:border-error focus:ring-2 focus:ring-error/10"
                            : "border-white/10 hover:border-white/20 focus:border-primary/70 focus:bg-[#29282b] focus:ring-4 focus:ring-primary/10"
                        }`}
                        inputMode={name === "mobile" ? "numeric" : undefined}
                        maxLength={name === "mobile" ? 9 : undefined}
                        name={name}
                        onChange={update}
                        placeholder={
                          name === "firstName"
                            ? "Enter your first name"
                            : name === "lastName"
                              ? "Enter your last name"
                              : name === "mobile"
                                ? "4XXXXXXXX"
                                : "you@example.com"
                        }
                        type={type}
                        value={values[name]}
                      />

                      {fieldErrors[name] && (
                        <p className="mt-2 text-xs text-error">
                          {fieldErrors[name]}
                        </p>
                      )}
                    </label>
                  ))}
                </div>

                {/* FORM ACTIONS */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    className="rounded-xl px-5 py-3 text-sm font-medium text-on-surface-variant transition-all hover:bg-white/5 hover:text-white"
                    onClick={() => {
                      setValues(getProfileValues(user, addresses));

                      setFieldErrors({});
                      setProfileNotice(null);
                      setEditing(false);
                    }}
                    type="button"
                  >
                    Discard changes
                  </button>

                  <button
                    className="rounded-xl px-6 py-3.5 text-sm font-semibold text-white primary-gradient shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/30"
                    type="submit"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[19px]">
                        save
                      </span>
                      Save changes
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-[#19181b] p-6 sm:p-8 lg:p-10">
                <div className="mb-7">
                  <h2 className="font-headline-md text-2xl text-white sm:text-3xl">
                    Personal information
                  </h2>

                  <div className="mt-3 h-1 w-10 rounded-full bg-primary" />

                  <p className="mt-4 text-sm text-on-surface-variant">
                    Your account details and contact information.
                  </p>
                </div>

                {/* 
                  FINAL DISPLAY LAYOUT:

                  ROW 1:
                  FIRST NAME | LAST NAME | MOBILE

                  ROW 2:
                  EMAIL
                */}
                <div className="grid gap-x-12 gap-y-8 sm:grid-cols-3">
                  {/* FIRST NAME */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                      First name
                    </p>

                    <p className="mt-2 text-base font-medium text-white">
                      {user?.firstName ?? values.firstName}
                    </p>
                  </div>

                  {/* LAST NAME */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                      Last name
                    </p>

                    <p className="mt-2 text-base font-medium text-white">
                      {user?.lastName ?? values.lastName}
                    </p>
                  </div>

                  {/* MOBILE */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                      Mobile
                    </p>

                    <p className="mt-2 text-base font-medium text-white">
                      {user?.mobile || values.mobile || "Not added"}
                    </p>
                  </div>

                  {/* EMAIL - SECOND ROW */}
                  <div className="sm:col-span-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                      Email
                    </p>

                    <p className="mt-2 break-words text-base font-medium text-white">
                      {user?.email ?? values.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </Reveal>

      {/* =========================
          PROFILE NOTICE
      ========================= */}

      {profileNotice && (
        <div className="mx-auto mt-4 max-w-7xl px-margin-mobile md:px-margin-desktop">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              profileNotice.tone === "success"
                ? "border-green-500/20 bg-green-500/10"
                : "border-primary/20 bg-primary/10"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[19px] ${
                profileNotice.tone === "success"
                  ? "text-green-400"
                  : "text-primary"
              }`}
            >
              {profileNotice.tone === "success" ? "check_circle" : "info"}
            </span>

            <p
              className={`text-sm ${
                profileNotice.tone === "success"
                  ? "text-green-300"
                  : "text-primary"
              }`}
            >
              {profileNotice.text}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          SAVED ADDRESSES
      ========================= */}

      <Reveal delay={80}>
        <section className="mx-auto mt-6 max-w-7xl px-margin-mobile md:px-margin-desktop">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>

                  <h2 className="font-headline-md text-2xl sm:text-3xl">
                    Saved addresses
                  </h2>
                </div>

                <p className="mt-2 text-sm text-on-surface-variant">
                  Choose a default address or manage your saved delivery
                  locations.
                </p>
              </div>

              <button
                className="w-full rounded-lg px-5 py-3 text-sm font-medium text-white primary-gradient shadow-lg shadow-primary/10 transition-transform hover:-translate-y-0.5 sm:w-auto"
                onClick={() => openAddressEditor()}
                type="button"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                  Add new address
                </span>
              </button>
            </div>

            {/* ADDRESS EDITOR */}
            {addressEditor && (
              <form
                className="mt-6 grid gap-5 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:grid-cols-2"
                noValidate
                onSubmit={saveAddress}
              >
                {/* ADDRESS LABEL */}
                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Address label
                  </span>

                  <input
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    onChange={(event) =>
                      setAddressEditor((current) => ({
                        ...current,
                        label: event.target.value,
                      }))
                    }
                    placeholder="Home, Work, etc."
                    value={addressEditor.label}
                  />
                </label>

                {/* CITY */}
                <label>
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    City / suburb
                  </span>

                  <input
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    onChange={(event) =>
                      setAddressEditor((current) => ({
                        ...current,
                        city: event.target.value.replace(/[^A-Za-z '-]/g, ""),
                      }))
                    }
                    placeholder="e.g. Melbourne"
                    value={addressEditor.city}
                  />

                  <p className="mt-2 text-xs text-on-surface-variant">
                    Enter a valid Australian city or locality.
                  </p>
                </label>

                {/* STREET ADDRESS */}
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    Street address
                  </span>

                  <input
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-high px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                    onChange={(event) =>
                      setAddressEditor((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    placeholder="123 George Street"
                    value={addressEditor.address}
                  />
                </label>

                {/* DEFAULT ADDRESS */}
                <label className="flex items-center gap-3 text-sm sm:col-span-2">
                  <input
                    checked={addressEditor.isDefault}
                    className="h-4 w-4 rounded border-primary/40 bg-surface-container-high text-primary focus:ring-primary"
                    onChange={(event) =>
                      setAddressEditor((current) => ({
                        ...current,
                        isDefault: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />

                  <span>Set as default delivery address</span>
                </label>

                {/* ADDRESS ERROR + BUTTONS */}
                <div className="sm:col-span-2">
                  {addressError && (
                    <p className="mb-4 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                      {addressError}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-lg px-5 py-2.5 text-sm font-medium text-white primary-gradient"
                      type="submit"
                    >
                      Save address
                    </button>

                    <button
                      className="rounded-lg border border-primary/30 px-5 py-2.5 text-sm transition-colors hover:border-primary hover:bg-primary/10"
                      onClick={() => setAddressEditor(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* SAVED ADDRESS LIST */}
            {addresses.length ? (
              <div className="mt-6 space-y-3">
                {addresses.map((address) => (
                  <SavedAddressCard
                    address={address}
                    key={address.id}
                    onDelete={() => deleteAddress(address.id)}
                    onEdit={() => openAddressEditor(address)}
                    onSetDefault={() =>
                      saveAddressCollection(
                        setDefaultAddress(addresses, address.id)
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  location_on
                </span>

                <p className="mt-3 text-sm text-on-surface-variant">
                  No saved addresses yet. Add one now or at checkout.
                </p>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* =========================
          WISHLIST
      ========================= */}

      <Reveal delay={140}>
        <section className="mx-auto mt-6 max-w-7xl px-margin-mobile md:px-margin-desktop">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    favorite
                  </span>

                  <h2 className="font-headline-md text-2xl sm:text-3xl">
                    Wishlist
                  </h2>
                </div>

                <p className="mt-2 text-sm text-on-surface-variant">
                  Products you have saved for later.
                </p>
              </div>

              <button
                className="text-sm font-medium text-primary transition-colors hover:text-primary/70 hover:underline"
                onClick={() => navigate("/wishlist")}
                type="button"
              >
                View full wishlist
              </button>
            </div>

            {wishlistNotice && (
              <div
                className="mt-5 flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300"
                role="status"
              >
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>

                {wishlistNotice}
              </div>
            )}

            {wishlistItems.length ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {wishlistItems.slice(0, 3).map((product) => (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 transition-all duration-300 hover:border-primary/40 hover:bg-primary/10"
                    key={product.name}
                  >
                    <img
                      alt=""
                      className="h-16 w-16 rounded-lg bg-surface-container-high object-contain p-1"
                      src={product.image}
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        className="block truncate font-medium transition-colors hover:text-primary"
                        to={`/product/${
                          product.slug ??
                          product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        }`}
                      >
                        {product.name}
                      </Link>

                      <p className="mt-1 text-sm text-on-surface-variant">
                        {formatCurrency(parsePrice(product.price))}
                      </p>
                    </div>

                    <button
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-error/20 bg-error/5 text-error transition-all duration-200 hover:border-error/40 hover:bg-error/10"
                      onClick={() => toggleWishlist(product)}
                      title={`Remove ${product.name} from wishlist`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  favorite_border
                </span>

                <p className="mt-3 text-sm text-on-surface-variant">
                  Your wishlist is empty.
                </p>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* =========================
          ORDER HISTORY
      ========================= */}

      <section className="mx-auto mt-6 max-w-7xl px-margin-mobile md:px-margin-desktop">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-headline-md text-2xl">Order history</h2>

              <p className="mt-2 text-sm text-on-surface-variant">
                View previous purchases and open individual order details.
              </p>
            </div>

            <button
              className="rounded-lg px-5 py-2 text-sm text-white primary-gradient"
              onClick={() => navigate("/order-history")}
              type="button"
            >
              View order history
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
