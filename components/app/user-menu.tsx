"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Repeat, Settings, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSession } from "@/components/providers/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { focusRing } from "@/lib/styles";
import { cn } from "@/lib/utils";

function Item({
  icon: Icon,
  children,
  onSelect,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className="rounded-control text-text data-[highlighted]:bg-hover-surface flex h-9 cursor-pointer items-center gap-2.5 px-2.5 text-[14px] outline-none"
    >
      <Icon className="text-text-muted size-4" strokeWidth={1.5} aria-hidden />
      {children}
    </DropdownMenu.Item>
  );
}

export function UserMenu() {
  const { user, role, viewAs } = useSession();
  const router = useRouter();
  const otherRole = role === "admin" ? "learner" : "admin";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={cn(
          "rounded-control hover:bg-hover-surface flex w-full items-center gap-2.5 p-2 text-left transition-colors",
          focusRing,
        )}
      >
        <Avatar name={user.fullName} size={30} />
        <span className="min-w-0 flex-1">
          <span className="text-text block truncate text-[13px] font-medium">
            {user.fullName}
          </span>
          <span className="text-text-muted block text-[12px] capitalize">
            {role}
          </span>
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          side="top"
          sideOffset={8}
          className="rounded-card border-border bg-surface shadow-floating z-50 w-[210px] border p-1 motion-safe:data-[state=open]:animate-[layer-in_180ms_ease-out]"
        >
          <Item icon={Settings} onSelect={() => router.push("/settings")}>
            Settings
          </Item>
          <Item
            icon={Repeat}
            onSelect={() => {
              viewAs(otherRole);
              router.push(otherRole === "admin" ? "/dashboard" : "/my-tickets");
            }}
          >
            View as {otherRole}
          </Item>
          <DropdownMenu.Separator className="bg-border my-1 h-px" />
          <Item icon={LogOut} onSelect={() => router.push("/sign-in")}>
            Sign out
          </Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
