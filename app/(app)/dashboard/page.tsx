"use client";

import Link from "next/link";

import { AppTopBar } from "@/components/app/app-top-bar";
import { NewTicketButton } from "@/components/tickets/new-ticket-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PriorityLabel } from "@/components/ui/priority-label";
import { useToast } from "@/components/ui/toast";
import { DASHBOARD, getProfile, getTicket } from "@/lib/mock-data";
import { SPINE_CLASS } from "@/lib/ticket-view";
import { cn } from "@/lib/utils";

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border-border bg-surface border">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-text text-[14px] font-semibold">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function MetricTile({
  label,
  value,
  sub,
  attention = false,
}: {
  label: string;
  value: number;
  sub: string;
  attention?: boolean;
}) {
  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <p className="text-text-muted flex items-center gap-1.5 text-[11px] leading-[14px] font-medium tracking-[0.06em] uppercase">
        {attention ? (
          <span className="bg-st-new size-1.5 rounded-full" aria-hidden />
        ) : null}
        {label}
      </p>
      <p className="text-text mt-2 text-[30px] leading-9 font-semibold tabular-nums">
        {value}
      </p>
      <p
        className={cn(
          "mt-0.5 text-[12px]",
          attention ? "text-st-new" : "text-text-2",
        )}
      >
        {sub}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const toast = useToast();
  const maxCategory = Math.max(...DASHBOARD.byCategory.map((c) => c.count));

  return (
    <>
      <AppTopBar title="Dashboard" actions={<NewTicketButton />} />
      <div className="flex flex-col gap-6 p-6 max-sm:p-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h1 className="text-title text-text font-semibold tracking-[-0.01em]">
            Overview
          </h1>
          <p className="text-text-muted text-[12px]">
            Cohort 2026-RTT-23 · updated just now
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            label="Open"
            value={DASHBOARD.open}
            sub="across all categories"
          />
          <MetricTile
            label="In progress"
            value={DASHBOARD.inProgress}
            sub="being worked now"
          />
          <MetricTile
            label="Resolved"
            value={DASHBOARD.resolvedThisWeek}
            sub="this week"
          />
          <MetricTile
            label="Unassigned"
            value={DASHBOARD.unassigned}
            sub="need attention"
            attention
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-6">
            <Card
              title="Needs attention"
              action={
                <Link
                  href="/tickets"
                  className="text-accent-text text-[12px] font-medium"
                >
                  View queue
                </Link>
              }
            >
              <div className="flex flex-col gap-1">
                {DASHBOARD.needsAttention.map((id) => {
                  const ticket = getTicket(id);
                  if (!ticket) return null;
                  return (
                    <div
                      key={id}
                      className="rounded-control flex items-center gap-3 px-1 py-2"
                    >
                      <span
                        className={cn(
                          "h-8 w-1 shrink-0 rounded-full",
                          SPINE_CLASS[ticket.status],
                        )}
                        aria-hidden
                      />
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="text-text-muted font-mono text-[12px] tabular-nums"
                      >
                        {ticket.id}
                      </Link>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="text-text min-w-0 flex-1 truncate text-[14px] font-medium"
                      >
                        {ticket.title}
                      </Link>
                      <PriorityLabel priority={ticket.priority} />
                      <Button
                        variant="secondary"
                        onClick={() =>
                          toast({ message: `${ticket.id} assigned to you` })
                        }
                      >
                        Assign to me
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Recent activity">
              <div className="flex flex-col gap-3.5">
                {DASHBOARD.recentActivity.map((event, index) => {
                  const actor = getProfile(event.actorId);
                  if (!actor) return null;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 text-[13px]"
                    >
                      <Avatar name={actor.fullName} size={20} />
                      <p className="text-text-2">
                        <span className="text-text font-medium">
                          {actor.fullName}
                        </span>{" "}
                        {event.action}{" "}
                        <Link
                          href={`/tickets/${event.ticketId}`}
                          className="text-accent-text font-mono"
                        >
                          {event.ticketId}
                        </Link>
                        {event.flaggedForKb
                          ? " and flagged it for the Knowledge Base"
                          : ""}{" "}
                        <span className="text-text-muted">
                          · {event.timeLabel}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card title="Tickets by category">
            <div className="flex flex-col gap-3">
              {DASHBOARD.byCategory.map((row) => (
                <div
                  key={row.category}
                  className="flex items-center gap-3 text-[13px]"
                >
                  <span className="text-text-2 w-36 shrink-0 truncate">
                    {row.category}
                  </span>
                  <span className="bg-hover-surface h-1.5 flex-1 overflow-hidden rounded-full">
                    <span
                      className="bg-border-strong block h-full rounded-full"
                      style={{ width: `${(row.count / maxCategory) * 100}%` }}
                    />
                  </span>
                  <span className="text-text w-5 text-right font-mono tabular-nums">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-border mt-4 flex items-center justify-between border-t pt-4 text-[13px]">
              <span className="text-text-2">Median time to resolve</span>
              <span className="text-text font-mono tabular-nums">
                {DASHBOARD.medianResolve}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
