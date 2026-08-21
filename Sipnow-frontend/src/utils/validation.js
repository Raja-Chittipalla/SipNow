// Shared validation rules keep authentication and profile updates consistent.
export const NAME_PART_PATTERN =
  /^[A-Za-z](?:[A-Za-z]|[ '-](?=[A-Za-z])){1,49}$/;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
export const AUSTRALIAN_MOBILE_PATTERN = /^4\d{8}$/;

export function isValidEmail(value) {
  const email = String(value ?? "").trim();
  if (email.length > 254 || /\s/.test(email)) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (
    !local ||
    !domain ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..")
  )
    return false;

  const labels = domain.split(".");
  return (
    labels.length >= 2 &&
    labels.every((label) =>
      /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label)
    ) &&
    /^[A-Za-z]{2,63}$/.test(labels.at(-1))
  );
}
