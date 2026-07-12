"use client";

import {
  BookOpen,
  Inbox,
  LayoutGrid,
  Plus,
  RotateCcw,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import * as React from "react";

import { TicketCard } from "@/components/tickets/ticket-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { NotificationItem } from "@/components/ui/notification-item";
import { PriorityLabel } from "@/components/ui/priority-label";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/select";
import { SidebarNavItem } from "@/components/ui/sidebar-nav-item";
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ToastCard, useToast } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { TopBar } from "@/components/ui/top-bar";
import { TICKET_CATEGORIES } from "@/lib/tickets";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-text-muted text-[11px] leading-[14px] font-medium tracking-[0.06em] uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Library() {
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [notifyOn, setNotifyOn] = React.useState(true);
  const categoryOptions = TICKET_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <div className="bg-bg text-text flex flex-col gap-8 p-6">
      <Logo subLabel="2026-RTT-23" />

      <Section title="Buttons">
        <Row>
          <Button>Open a ticket</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Dismiss</Button>
          <Button>
            <Plus className="size-4" strokeWidth={1.5} />
            New ticket
          </Button>
          <Button iconOnly aria-label="Reopen" variant="secondary">
            <RotateCcw className="size-4" strokeWidth={1.5} />
          </Button>
        </Row>
        <Row>
          <Button disabled>Disabled</Button>
          <Button loading loadingText="Opening ticket">
            Open ticket
          </Button>
          <Button size="touch">Touch size</Button>
        </Row>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <Input label="Email" placeholder="you@cohort.dev" />
          <Input
            label="Search"
            leadingIcon={Inbox}
            placeholder="With an icon"
          />
          <Input
            label="Email"
            defaultValue="redeem@gmail.com"
            error="That email is not on the cohort list. Use your Per Scholas address."
          />
          <Input label="Disabled" placeholder="Read only" disabled />
        </div>
        <div className="max-w-xl">
          <Textarea
            label="Description"
            placeholder="What happened, what you expected, and what you have already tried"
          />
        </div>
      </Section>

      <Section title="Select and search">
        <div className="flex max-w-xl flex-wrap gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            placeholder="Select"
            className="w-60"
          />
          <div className="w-72">
            <SearchField />
          </div>
        </div>
      </Section>

      <Section title="Status pills">
        <Row>
          <StatusPill status="new" />
          <StatusPill status="in_progress" />
          <StatusPill status="resolved" />
          <StatusPill status="closed" />
        </Row>
      </Section>

      <Section title="Priority">
        <Row>
          <PriorityLabel priority="low" />
          <PriorityLabel priority="medium" />
          <PriorityLabel priority="high" />
        </Row>
      </Section>

      <Section title="Ticket cards (signature)">
        <div className="flex max-w-2xl flex-col gap-2">
          <TicketCard
            id="PS-0001"
            title="Can't connect to the lab VM over RDP"
            status="new"
            priority="high"
            category="Network and Access"
            updatedLabel="2h ago"
            updatedTitle="Jul 9, 05:40 PM"
            href="#"
          />
          <TicketCard
            id="PS-0003"
            title="VS Code can't find my Python interpreter"
            status="in_progress"
            priority="medium"
            category="Software and IDE"
            assignee={{ name: "Andre T." }}
            updatedLabel="1h ago"
            updatedTitle="Jul 9, 06:40 PM"
            href="#"
          />
          <TicketCard
            id="PS-0005"
            title="Zoom mic not picking up audio in class"
            status="resolved"
            priority="low"
            category="Hardware and AV"
            assignee={{ name: "Andre T." }}
            updatedLabel="3h ago"
            updatedTitle="Jul 9, 04:40 PM"
            href="#"
          />
          <TicketCard
            id="PS-0006"
            title="Campus Wi-Fi keeps dropping every few minutes"
            status="closed"
            priority="medium"
            category="Network and Access"
            updatedLabel="1d ago"
            updatedTitle="Jul 8, 05:40 PM"
            href="#"
          />
        </div>
      </Section>

      <Section title="Sidebar nav">
        <div className="rounded-card border-border bg-surface flex w-60 flex-col gap-1 border p-2">
          <SidebarNavItem
            icon={TicketIcon}
            label="Tickets"
            href="#"
            count={7}
          />
          <SidebarNavItem icon={Inbox} label="My tickets" href="#" active />
          <SidebarNavItem
            icon={BookOpen}
            label="Knowledge Base"
            href="#"
            external
          />
          <SidebarNavItem icon={LayoutGrid} label="Dashboard" href="#" />
          <SidebarNavItem icon={Users} label="People" href="#" />
        </div>
      </Section>

      <Section title="Top bar">
        <div className="rounded-card border-border bg-surface overflow-hidden border">
          <TopBar title="Tickets" search={<SearchField className="w-72" />}>
            <Button>
              <Plus className="size-4" strokeWidth={1.5} />
              New ticket
            </Button>
            <Avatar name="Andre T." size={32} />
          </TopBar>
        </div>
      </Section>

      <Section title="Avatars">
        <Row>
          <Avatar name="Redeem G." size={24} />
          <Avatar name="Andre T." size={32} />
          <Avatar name="Priya S." size={48} />
        </Row>
      </Section>

      <Section title="Toggle">
        <label className="text-text flex items-center gap-3 text-[14px]">
          <Toggle
            checked={notifyOn}
            onCheckedChange={setNotifyOn}
            aria-label="A ticket is assigned to me"
          />
          A ticket is assigned to me
        </label>
      </Section>

      <Section title="Empty state">
        <div className="rounded-card border-border bg-surface max-w-md border">
          <EmptyState
            icon={TicketIcon}
            title="Open your first ticket to get started"
            body="Stuck on something? Describe it and someone in the cohort will pick it up."
            action={<Button>Open a ticket</Button>}
          />
        </div>
      </Section>

      <Section title="Notifications">
        <div className="rounded-card border-border bg-surface w-80 overflow-hidden border">
          <NotificationItem
            read={false}
            timeLabel="2m ago"
            message={
              <>
                Andre T. assigned{" "}
                <span className="text-accent-text font-mono">PS-0003</span> to
                you
              </>
            }
          />
          <div className="border-border border-t" />
          <NotificationItem
            read
            timeLabel="3h ago"
            message={
              <>
                <span className="text-accent-text font-mono">PS-0005</span> was
                resolved
              </>
            }
          />
        </div>
      </Section>

      <Section title="Dialog and toast">
        <Row>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Open dialog
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast({ tone: "success", message: "Ticket PS-0007 submitted" })
            }
          >
            Show toast
          </Button>
        </Row>
        <ToastCard tone="success" message="Ticket PS-0007 submitted" />
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Promote to Knowledge Base?"
          description="This flags the fix as a candidate article and shares it with the Learners Hub team. They review and publish."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Promote</Button>
            </>
          }
        />
      </Section>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <div className="bg-bg min-h-dvh">
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-title text-text font-semibold">
            Component library
          </h1>
          <p className="text-text-2 text-[13px]">
            Built to the inventory, themed from the tokens. Dark and light shown
            together.
          </p>
        </div>
        <ThemeToggle />
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="dark border-border border-b lg:border-r lg:border-b-0">
          <Library />
        </div>
        <div className="light">
          <Library />
        </div>
      </div>
    </div>
  );
}
