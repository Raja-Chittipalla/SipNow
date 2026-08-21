/** Placeholder anchors (href="#") shouldn't jump the page to the top. */
export function preventNav(e) {
  e.preventDefault();
}

/** Smooth-scrolls to a section by id, for CTAs that stand in for real destination pages. */
export function scrollToSection(id) {
  return (e) => {
    e?.preventDefault();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
