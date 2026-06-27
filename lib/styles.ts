// The control focus ring: a 2px gap in the surface behind, then a 2px accent
// ring (the design's "0 0 0 2px surface, 0 0 0 4px accent"). Components on a
// card pass ring-offset-surface to keep the gap reading as the surface they
// sit on.
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
