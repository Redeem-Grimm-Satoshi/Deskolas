"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import type { TourStep } from "@/lib/tour";
import { cn } from "@/lib/utils";
import { TourCard } from "./tour-card";

const GUTTER = 16;
const SPOTLIGHT_PAD = 8;
const CARD_GAP = 12;
const FIND_TRIES = 50;
const FIND_INTERVAL_MS = 100;

type Box = { top: number; left: number; width: number; height: number };

// The first anchor that is actually laid out. The sidebar renders twice on
// small screens (hidden aside plus the drawer), so a zero-size match is not
// the one we want.
function findAnchor(target: string) {
  const nodes = document.querySelectorAll<HTMLElement>(
    `[data-tour="${target}"]`,
  );
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return node;
  }
  return null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function TourOverlay({
  steps,
  index,
  label,
  onIndexChange,
  onEnd,
}: {
  steps: readonly TourStep[];
  index: number;
  label: string;
  onIndexChange: (index: number) => void;
  onEnd: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const step = steps[index];

  // Both pieces of state remember which step (or element) they belong to, so
  // moving to the next step invalidates them without a reset.
  const [found, setFound] = React.useState<{
    stepId: string;
    el: HTMLElement;
  } | null>(null);
  const [measured, setMeasured] = React.useState<{
    el: HTMLElement;
    box: Box;
  } | null>(null);
  const anchor = found?.stepId === step.id ? found.el : null;
  const box = anchor && measured?.el === anchor ? measured.box : null;

  const cardRef = React.useRef<HTMLDivElement>(null);
  // Which way to skip when a step's anchor is missing on this screen.
  const direction = React.useRef<1 | -1>(1);

  const move = React.useCallback(
    (delta: 1 | -1) => {
      direction.current = delta;
      const next = index + delta;
      if (next < 0 || next >= steps.length) onEnd();
      else onIndexChange(next);
    },
    [index, steps.length, onEnd, onIndexChange],
  );

  // Locate the anchor, navigating first when the step lives on another page.
  // A step whose anchor never shows up is skipped in the direction of travel.
  React.useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (step.route && pathname !== step.route) router.push(step.route);

    const tick = () => {
      if (cancelled) return;
      const el = findAnchor(step.target);
      if (el) {
        setFound({ stepId: step.id, el });
        return;
      }
      tries += 1;
      if (tries >= FIND_TRIES) {
        move(direction.current);
        return;
      }
      timer = setTimeout(tick, FIND_INTERVAL_MS);
    };
    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [step, pathname, router, move]);

  // Keep the spotlight on the anchor through scrolling and resizing.
  React.useLayoutEffect(() => {
    if (!anchor) return;
    const measure = () => {
      const rect = anchor.getBoundingClientRect();
      setMeasured({
        el: anchor,
        box: {
          top: rect.top - SPOTLIGHT_PAD,
          left: rect.left - SPOTLIGHT_PAD,
          width: rect.width + SPOTLIGHT_PAD * 2,
          height: rect.height + SPOTLIGHT_PAD * 2,
        },
      });
    };
    anchor.scrollIntoView({ block: "nearest", inline: "nearest" });
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [anchor]);

  // Place the card below the anchor, above it when there is no room, and
  // beside it as a last resort. On phones it is a bottom sheet instead. This
  // is a measurement pass, so it writes the position straight to the element
  // rather than through state.
  React.useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || !box) return;
    if (!window.matchMedia("(min-width: 640px)").matches) {
      card.style.top = "";
      card.style.left = "";
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    let top = box.top + box.height + CARD_GAP;
    let left = box.left;
    if (top + ch > vh - GUTTER) top = box.top - CARD_GAP - ch;
    if (top < GUTTER) {
      top = clamp(box.top, GUTTER, vh - GUTTER - ch);
      left = box.left + box.width + CARD_GAP;
      if (left + cw > vw - GUTTER) left = box.left - CARD_GAP - cw;
    }
    card.style.top = `${clamp(top, GUTTER, vh - GUTTER - ch)}px`;
    card.style.left = `${clamp(left, GUTTER, vw - GUTTER - cw)}px`;
  }, [box]);

  // The card mounts once the anchor is measured; focus it then, per step.
  const ready = box !== null;
  React.useEffect(() => {
    if (ready) cardRef.current?.focus({ preventScroll: true });
  }, [ready, step.id]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      onEnd();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Tab" && cardRef.current) {
      const items = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div
      className={cn("fixed inset-0 z-50", !box && "bg-[var(--scrim)]")}
      onKeyDown={handleKeyDown}
    >
      {box ? (
        <>
          <div
            aria-hidden
            className="rounded-card border-border-strong pointer-events-none fixed border shadow-[0_0_0_200vmax_var(--scrim)] motion-safe:animate-[scrim-in_200ms_ease-out]"
            style={box}
          />
          <TourCard
            key={step.id}
            ref={cardRef}
            label={label}
            title={step.title}
            body={step.body}
            index={index}
            total={steps.length}
            onNext={() => move(1)}
            onBack={() => move(-1)}
            onSkip={onEnd}
            className="fixed motion-safe:animate-[layer-in_220ms_ease-out] max-sm:inset-x-4 max-sm:bottom-4 max-sm:w-auto"
          />
        </>
      ) : null}
    </div>
  );
}
