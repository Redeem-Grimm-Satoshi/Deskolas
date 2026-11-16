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
import { TourLauncher } from "@/components/tour/tour-launcher";
import { UserMenu } from "./user-menu";

type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  tour: string;
};

// The open board and My tickets are for everyone: anyone can browse and claim.
// Admins additionally get the oversight views (Dashboard, People).
const MEMBER_NAV: NavItem[] = [
  { icon: Ticket, label: "Tickets", href: "/tickets", tour: "nav-tickets" },
  {
    icon: Inbox,
    label: "My tickets",
    href: "/my-tickets",
    tour: "nav-my-tickets",
  },
];

const ADMIN_NAV: NavItem[] = [
  { icon: Ticket, label: "Tickets", href: "/tickets", tour: "nav-tickets" },
  {
    icon: LayoutGrid,
    label: "Dashboard",
    href: "/dashboard",
    tour: "nav-dashboard",
  },
  {
    icon: Inbox,
    label: "My tickets",
    href: "/my-tickets",
    tour: "nav-my-tickets",
  },
  { icon: Users, label: "People", href: "/people", tour: "nav-people" },
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
            tour={item.tour}
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
          tour="nav-kb"
        />
        <TourLauncher />
      </nav>
      <div className="border-border border-t p-3">
        <UserMenu />
      </div>
    </div>
  );
}
