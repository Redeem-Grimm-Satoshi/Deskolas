# Deskolas brand assets

The approved logo is the **D monogram** (concept 04): a geometric flat letter D, white, inside an `accent` (`#0EA5E9`) rounded square. Flat fill, no gradient, no glow. The motif is geometry only and is never expressed by changing color or type.

## Files

### Vector (`svg/`), use these wherever possible, they scale cleanly

| File                  | What                                   | Use                                          |
| --------------------- | -------------------------------------- | -------------------------------------------- |
| `mark-primary.svg`    | white D on accent square               | the app icon, nav, anywhere on light or dark |
| `mark-mono-dark.svg`  | single-ink outline + D, `#18181B`      | one-color print on light, stamps, embossing  |
| `mark-mono-light.svg` | single-ink outline + D, white          | one-color on dark or over photos             |
| `glyph-accent.svg`    | bare D in accent, no square            | tight spaces, watermarks, bullets            |
| `glyph-ink.svg`       | bare D in ink                          | one-color contexts without the square        |
| `lockup-dark.svg`     | mark + "Deskolas" wordmark, light text | dark backgrounds                             |
| `lockup-light.svg`    | mark + "Deskolas" wordmark, dark text  | light backgrounds                            |
| `favicon.svg`         | mark, tuned corners for small sizes    | browser tab, PWA                             |

### Raster (`png/`), transparent unless noted

- `mark-primary-{512,256,128,64,32}.png`, transparent, the main mark at common sizes.
- `mark-mono-light-512.png`, `mark-mono-dark-512.png`, transparent mono marks.
- `glyph-accent-512.png`, transparent bare glyph.
- `favicon-32.png`, 32px favicon. `apple-touch-icon-180.png`, 180px iOS icon.
- `lockup-dark.png` (on `#09090B`), `lockup-light.png` (on `#FFFFFF`), wordmark lockups; backed, not transparent, since they ship on their intended surface.

## Color

- Square / accent: `#0EA5E9`. Hover `#0284C7`, pressed `#0369A1`.
- D and the square knockout: white `#FFFFFF` on the primary mark.
- Wordmark: `Deskolas` set in Inter 600, tracking `-0.02em`, sentence case. Light-surface ink `#18181B`, dark-surface ink `#F4F4F5`.

## Usage rules

- Keep clear space around the mark equal to the height of the inner D.
- Minimum size: 16px for the mark, 20px tall for the lockup. Below that use `favicon.svg`.
- Do not recolor the square outside the accent ramp, add gradients, glows, or shadows, rotate it, or outline the primary mark.
- Do not substitute a lucide `Ticket` glyph (or any other icon) for the logo. `Ticket` is a UI icon for the Tickets nav item only.
- The perforated-stub motif belongs on ticket cards, never on the logo.

## In code

Ship `mark-primary.svg` as an inline React component (`<Logo />`) so it inherits crisp rendering, plus `favicon.svg` + `apple-touch-icon-180.png` in `app/`. The square is `accent`; the D is `#fff` with `fill-rule="evenodd"` so the counter stays knocked out.
