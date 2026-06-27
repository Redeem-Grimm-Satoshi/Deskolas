"use client";

import { Ticket as TicketIcon } from "lucide-react";
import * as React from "react";

import { AppTopBar } from "@/components/app/app-top-bar";
import { useSession } from "@/components/providers/session-provider";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { TicketCard } from "@/components/tickets/ticket-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { ticketsForLearner } from "@/lib/mock-data";
import { sortTickets, ticketCardProps } from "@/lib/ticket-view";
import type { TicketStatus } from "@/lib/tickets";

type Filter = "all" | "open" | "resolved" | "closed";

const TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const OPEN_STATUSES: TicketStatus[] = ["new", "in_progress"];

export default function MyTicketsPage() {
  const { user } = useSession();
  const [filter, setFilter] = React.useState<Filter>("all");
  const [query, setQuery] = React.useState("");

  const mine = ticketsForLearner(user.id);

  const filtered = sortTickets(
    mine.filter((ticket) => {
      if (filter === "open" && !OPEN_STATUSES.includes(ticket.status))
        return false;
      if (filter === "resolved" && ticket.status !== "resolved") return false;
      if (filter === "closed" && ticket.status !== "closed") return false;
      if (query && !ticket.title.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    }),
  );

  return (
    <>
      <AppTopBar
        title="My tickets"
        search={
          <SearchField
            className="w-72"
            placeholder="Search my tickets"
            aria-label="Search my tickets"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
        actions={<NewTicketButton />}
      />
      <div className="flex flex-col gap-4 p-6 max-sm:p-4">
        {mine.length > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <SegmentedTabs
                options={TABS}
                value={filter}
                onChange={setFilter}
              />
              <span className="text-text-muted text-[13px]">
                {mine.length} {mine.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {filtered.map((ticket) => (
                <TicketCard key={ticket.id} {...ticketCardProps(ticket)} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-card border-border border">
            <EmptyState
              icon={TicketIcon}
              title="Open your first ticket to get started"
              body="Stuck on something? Describe it and someone in the cohort will pick it up."
              action={<NewTicketButton />}
            />
          </div>
        )}
      </div>
    </>
  );
}
