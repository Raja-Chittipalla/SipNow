const COMMON_TYPO_DOMAINS = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",

  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",

  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",

  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
};

// Only these email domains are allowed.
const COMMON_PROVIDER_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
];

export function validateEmail(email) {
  const value = String(email ?? "").trim();

  // Required / length / spaces
  if (!value || value.length > 254 || /\s/.test(value)) {
    return "Enter a valid email address";
  }

  // Must contain exactly one @
  const parts = value.split("@");

  if (parts.length !== 2) {
    return "Enter a valid email address";
  }

  const [localPart, domain] = parts;
  const lowerDomain = domain.toLowerCase();

  // Basic email structure
  const emailPattern =
    /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

  if (!emailPattern.test(value)) {
    return "Enter a valid email address";
  }

  // Invalid dots
  if (
    localPart.includes("..") ||
    domain.includes("..") ||
    localPart.startsWith(".") ||
    localPart.endsWith(".")
  ) {
    return "Enter a valid email address";
  }

  // Check common typo domains first
  const suggestedDomain = COMMON_TYPO_DOMAINS[lowerDomain];

  if (suggestedDomain) {
    return `Did you mean ${suggestedDomain}?`;
  }

  // IMPORTANT:
  // Only allow the exact domains listed above.
  if (!COMMON_PROVIDER_DOMAINS.includes(lowerDomain)) {
    return "Please enter a valid email from Gmail, Yahoo, Outlook, Hotmail, iCloud, or Proton.";
  }

  return "";
}

export function isValidEmail(email) {
  return validateEmail(email) === "";
}
