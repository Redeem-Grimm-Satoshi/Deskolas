"use client";

import * as RadixAvatar from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

type AvatarProps = {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
};

export function Avatar({ name, src, size = 32, className }: AvatarProps) {
  return (
    <RadixAvatar.Root
      style={{ width: size, height: size }}
      className={cn(
        "bg-avatar-surface inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none",
        className,
      )}
    >
      {src ? (
        <RadixAvatar.Image
          src={src}
          alt={name}
          className="size-full object-cover"
        />
      ) : null}
      <RadixAvatar.Fallback
        delayMs={src ? 200 : 0}
        style={{ fontSize: Math.max(8, Math.round(size * 0.32)) }}
        className="text-text font-semibold"
      >
        {initials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
