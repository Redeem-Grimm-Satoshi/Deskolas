"use client";

import {
  BookOpen,
  Inbox,
  LayoutGrid,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { useSession } from "@/components/providers/session-provider";
import { Logo } from "@/components/ui/logo";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { TICKETS } from "@/lib/mock-data";
import { UserMenu } from "./user-menu";

type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  count?: number;
};

const openCount = TICKETS.filter(
  (ticket) => ticket.status === "new" || ticket.status === "in_progress",
).length;

// The open board and My tickets are for everyone: anyone can browse and claim.
// Admins additionally get the oversight views (Dashboard, People).
const MEMBER_NAV: NavItem[] = [
  { icon: Ticket, label: "Tickets", href: "/tickets", count: openCount },
  { icon: Inbox, label: "My tickets", href: "/my-tickets" },
];

const ADMIN_NAV: NavItem[] = [
  { icon: Ticket, label: "Tickets", href: "/tickets", count: openCount },
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: Inbox, label: "My tickets", href: "/my-tickets" },
  { icon: Users, label: "People", href: "/people" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useSession();
  const nav = role === "admin" ? ADMIN_NAV : MEMBER_NAV;

  return (
    <div className="border-border bg-bg flex h-full w-60 flex-col border-r">
      <div className="px-4 py-5">
        <Logo subLabel="2026-RTT-23" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {nav.map((item) => (
          <SidebarNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            count={item.count}
            active={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
          />
        ))}
        <SidebarNavItem
          icon={BookOpen}
          label="Knowledge Base"
          href="https://learners-hub.bolt.host/"
          external
        />
      </nav>
      <div className="border-border border-t p-3">
        <UserMenu />
      </div>
    </div>
  );
}
