"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import * as React from "react";

import { useSession } from "@/components/providers/session-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { NotificationsBell } from "./notifications-bell";
import { Sidebar } from "./sidebar";

function MobileNavTrigger() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          iconOnly
          aria-label="Open navigation"
          className="lg:hidden"
        >
          <Menu className="size-[18px]" strokeWidth={1.5} />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--scrim)] lg:hidden" />
        <Dialog.Content
          aria-label="Navigation"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
          className="fixed inset-y-0 left-0 z-50 motion-safe:data-[state=open]:animate-[layer-in_220ms_ease-out] lg:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Sidebar />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AppTopBar({
  title,
  search,
  actions,
  className,
}: {
  title: string;
  search?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  const { user } = useSession();

  return (
    <header
      className={cn(
        "border-border bg-bg sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-6 max-sm:px-4",
        className,
      )}
    >
      <MobileNavTrigger />
      <h1 className="text-heading text-text shrink-0 font-semibold">{title}</h1>
      {search ? <div className="hidden min-w-0 sm:block">{search}</div> : null}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        {actions}
        <ThemeToggle />
        <NotificationsBell />
        <Avatar name={user.fullName} src={user.avatarUrl} size={32} />
      </div>
    </header>
  );
}
