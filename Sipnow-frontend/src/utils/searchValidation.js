const MAX_SEARCH_LENGTH = 100;

const HTML_TAG_PATTERN = /<[^>]*>/;
const HAS_LETTER_PATTERN = /[a-zA-Z]/;
const REPEATED_CHAR_PATTERN = /(.)\1{3,}/;

// Validates a raw search term before it's submitted. Returns
// { valid, reason } rather than throwing, since callers need to
// show the reason inline next to the search box.
export function validateSearchTerm(rawTerm) {
  const term = (rawTerm ?? "").trim();

  if (!term) {
    return { valid: false, reason: "Please enter a search term." };
  }

  if (term.length > MAX_SEARCH_LENGTH) {
    return {
      valid: false,
      reason: `Search term must be ${MAX_SEARCH_LENGTH} characters or fewer.`,
    };
  }

  if (HTML_TAG_PATTERN.test(term)) {
    return { valid: false, reason: "Search term cannot contain HTML tags." };
  }

  if (!HAS_LETTER_PATTERN.test(term)) {
    return {
      valid: false,
      reason: "Search term must contain at least one letter.",
    };
  }

  if (REPEATED_CHAR_PATTERN.test(term)) {
    return { valid: false, reason: "Please enter a valid search term." };
  }

  return { valid: true, reason: null };
}

export { MAX_SEARCH_LENGTH };
