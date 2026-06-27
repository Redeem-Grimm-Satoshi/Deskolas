import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

// The active item is the single accent moment in the chrome. Icon, count, and
// external glyph all inherit the row's text color (lucide draws in currentColor).
export function SidebarNavItem({
  icon: Icon,
  label,
  href,
  active = false,
  count,
  external = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  count?: number;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "rounded-control flex h-9 items-center gap-2.5 px-2.5 text-[14px] font-medium transition-colors duration-150 ease-out",
        active
          ? "bg-accent-tint text-accent-text"
          : "text-text-2 hover:text-text",
        focusRing,
      )}
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
      <span className="flex-1 truncate">{label}</span>
      {count != null ? (
        <span className="font-mono text-[12px] tabular-nums">{count}</span>
      ) : null}
      {external ? (
        <ArrowUpRight
          className="size-[14px] shrink-0"
          strokeWidth={1.5}
          aria-hidden
        />
      ) : null}
    </Link>
  );
}
