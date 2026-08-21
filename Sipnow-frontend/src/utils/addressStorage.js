const ADDRESS_STORAGE_KEY = "sipnow-addresses";

export function createAddressId() {
  return (
    window.crypto?.randomUUID?.() ??
    `address-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export function normalizeAddresses(addresses) {
  if (!Array.isArray(addresses)) return [];

  return addresses
    .filter((address) => address?.address)
    .map((address) => ({
      id: address.id ?? createAddressId(),
      label: address.label?.trim() || "Saved address",
      address: address.address.trim(),
      city: address.city?.trim() || "",
      isDefault: Boolean(address.isDefault),
    }));
}

export function readSavedAddresses(user) {
  const userAddresses = normalizeAddresses(user?.addresses);
  if (userAddresses.length) return userAddresses;

  try {
    return normalizeAddresses(
      JSON.parse(window.localStorage.getItem(ADDRESS_STORAGE_KEY))
    );
  } catch {
    return [];
  }
}

export function formatAddress(address) {
  return [address?.address, address?.city].filter(Boolean).join(", ");
}

export function upsertAddress(addresses, nextAddress) {
  const normalized = normalizeAddresses(addresses);
  const duplicate = normalized.find(
    (address) =>
      address.address.toLowerCase() === nextAddress.address.toLowerCase() &&
      address.city.toLowerCase() === nextAddress.city.toLowerCase()
  );

  if (duplicate) return { addresses: normalized, address: duplicate };

  const address = {
    id: nextAddress.id ?? createAddressId(),
    label: nextAddress.label?.trim() || `Address ${normalized.length + 1}`,
    address: nextAddress.address.trim(),
    city: nextAddress.city?.trim() || "",
    isDefault: Boolean(nextAddress.isDefault),
  };
  return { addresses: [...normalized, address], address };
}

export function setDefaultAddress(addresses, addressId) {
  return normalizeAddresses(addresses).map((address) => ({
    ...address,
    isDefault: address.id === addressId,
  }));
}

export function persistAddresses(addresses) {
  window.localStorage.setItem(
    ADDRESS_STORAGE_KEY,
    JSON.stringify(normalizeAddresses(addresses))
  );
}
