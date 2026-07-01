"use client";

import { Inbox } from "lucide-react";
import * as React from "react";

import { AppTopBar } from "@/components/app/app-top-bar";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { TicketCard } from "@/components/tickets/ticket-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { Select } from "@/components/ui/select";
import type { TicketView } from "@/lib/queries";
import { sortTickets, ticketCardProps } from "@/lib/ticket-view";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type TicketStatus,
} from "@/lib/tickets";

type StatusFilter = "all" | TicketStatus;

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const categoryFilterOptions = [
  { value: "all", label: "All categories" },
  ...TICKET_CATEGORIES.map((value) => ({ value, label: value })),
];

const priorityFilterOptions = [
  { value: "all", label: "All priorities" },
  ...TICKET_PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  })),
];

export function TicketsBoard({ tickets }: { tickets: TicketView[] }) {
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [category, setCategory] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [query, setQuery] = React.useState("");

  const filtered = sortTickets(
    tickets.filter((ticket) => {
      if (status !== "all" && ticket.status !== status) return false;
      if (category !== "all" && ticket.category !== category) return false;
      if (priority !== "all" && ticket.priority !== priority) return false;
      if (query && !ticket.title.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      return true;
    }),
  );

  const unassigned = filtered.filter(
    (ticket) => !ticket.assigneeId && ticket.status !== "closed",
  ).length;

  function clearFilters() {
    setStatus("all");
    setCategory("all");
    setPriority("all");
    setQuery("");
  }

  const filtersActive =
    status !== "all" ||
    category !== "all" ||
    priority !== "all" ||
    query !== "";

  return (
    <>
      <AppTopBar
        title="Tickets"
        search={
          <SearchField
            className="w-72"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
        actions={<NewTicketButton />}
      />
      <div className="flex flex-col gap-4 p-6 max-sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedTabs
            options={STATUS_TABS}
            value={status}
            onChange={setStatus}
          />
          <div className="flex gap-2">
            <Select
              aria-label="Filter by category"
              options={categoryFilterOptions}
              value={category}
              onValueChange={setCategory}
              className="w-44"
            />
            <Select
              options={priorityFilterOptions}
              value={priority}
              onValueChange={setPriority}
              className="w-40"
            />
          </div>
        </div>

        <p className="text-text-2 text-[13px]">
          {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
          {unassigned > 0 ? ` · ${unassigned} unassigned need attention` : ""}
        </p>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filtered.map((ticket) => (
              <TicketCard key={ticket.id} {...ticketCardProps(ticket)} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border-border border">
            <EmptyState
              icon={Inbox}
              title={
                status !== "all"
                  ? `Nothing ${STATUS_LABELS[status].toLowerCase()} yet`
                  : "No tickets match"
              }
              body={
                filtersActive
                  ? "Clear the filters to see the full queue."
                  : "New tickets from the cohort will land here."
              }
              action={
                filtersActive ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
