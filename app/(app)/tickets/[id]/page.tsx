"use client";

import { ChevronLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import * as React from "react";

import { NotificationsBell } from "@/components/app/notifications-bell";
import { useSession } from "@/components/providers/session-provider";
import { PromoteToKbButton } from "@/components/tickets/promote-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  getActivity,
  getComments,
  getProfile,
  getTicket,
  type Comment,
  type Ticket,
} from "@/lib/mock-data";
import { SPINE_CLASS } from "@/lib/ticket-view";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type TicketStatus,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

const PRIO_DOT = {
  low: "bg-prio-low",
  medium: "bg-prio-medium",
  high: "bg-prio-high",
} as const;

const statusOptions = (
  ["new", "in_progress", "resolved", "closed"] as const
).map((value) => ({ value, label: STATUS_LABELS[value] }));
const priorityOptions = TICKET_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));
const categoryOptions = TICKET_CATEGORIES.map((value) => ({
  value,
  label: value,
}));

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-muted text-[11px] leading-[14px] font-medium tracking-[0.06em] uppercase">
      {children}
    </p>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border-border bg-surface border p-5">
      {children}
    </div>
  );
}

function RailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-text-2">{label}</span>
      <span className="text-text">{children}</span>
    </div>
  );
}

function AssigneeValue({ id }: { id: string | null }) {
  const profile = getProfile(id);
  if (!profile) return <span className="text-text-muted">Unassigned</span>;
  return (
    <span className="flex items-center gap-1.5">
      <Avatar name={profile.fullName} size={18} />
      {profile.fullName}
    </span>
  );
}

function DetailHeader({
  ticketId,
  userName,
}: {
  ticketId: string;
  userName: string;
}) {
  return (
    <header className="border-border bg-bg sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-6 max-sm:px-4">
      <Link
        href="/tickets"
        className="text-text-2 hover:text-text flex items-center gap-1.5 text-[14px] transition-colors"
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
        Tickets
      </Link>
      <span className="text-text-muted font-mono text-[13px]">
        / {ticketId}
      </span>
      <div className="ml-auto flex items-center gap-3">
        <NotificationsBell />
        <Avatar name={userName} size={32} />
      </div>
    </header>
  );
}

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticket = getTicket(params.id);
  if (!ticket) notFound();
  return <TicketDetailView ticket={ticket} />;
}

function TicketDetailView({ ticket }: { ticket: Ticket }) {
  const { role, user } = useSession();
  const toast = useToast();
  const isAdmin = role === "admin";

  const [status, setStatus] = React.useState<TicketStatus>(ticket.status);
  const [assignedToId, setAssignedToId] = React.useState<string | null>(
    ticket.assignedToId,
  );
  const [notes, setNotes] = React.useState(ticket.resolutionNotes ?? "");
  const [comments, setComments] = React.useState<Comment[]>(() =>
    getComments(ticket.id),
  );
  const [draft, setDraft] = React.useState("");

  const submitter = getProfile(ticket.submittedById);
  const openedLabel =
    getActivity(ticket.id).find((event) => event.action.includes("opened"))
      ?.timeLabel ?? ticket.createdLabel;
  const events = getActivity(ticket.id);

  // Anyone signed in can read a ticket; the person working it (the claimer) or
  // an admin can change its state. This mirrors the Phase 2 row-level security
  // rule that replaces the old "see only your own tickets" restriction.
  const canWork = isAdmin || assignedToId === user.id;
  const showResolution =
    canWork || status === "resolved" || status === "closed";
  const notesEditable =
    canWork && (status === "new" || status === "in_progress");

  function advance(next: TicketStatus, message: string) {
    setStatus(next);
    toast({ message });
  }

  function claim() {
    setAssignedToId(user.id);
    if (status === "new") setStatus("in_progress");
    toast({ message: `You claimed ${ticket.id}` });
  }

  function postComment() {
    if (!draft.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        ticketId: ticket.id,
        authorId: user.id,
        body: draft.trim(),
        timeLabel: "just now",
      },
    ]);
    setDraft("");
  }

  return (
    <>
      <DetailHeader ticketId={ticket.id} userName={user.fullName} />

      <div className="grid gap-6 p-6 max-sm:p-4 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Panel>
            <div className="flex items-stretch gap-4">
              <span
                className={cn("w-1 shrink-0 rounded-full", SPINE_CLASS[status])}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <StatusPill status={status} />
                  <span className="text-text-2 flex items-center gap-1.5 text-[12px]">
                    <span
                      className={cn(
                        "size-[5px] rounded-full",
                        PRIO_DOT[ticket.priority],
                      )}
                      aria-hidden
                    />
                    {PRIORITY_LABELS[ticket.priority]} priority
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-3.5">
                  <span className="border-border text-text-muted self-stretch border-r border-dashed pr-3.5 font-mono text-[12px] tabular-nums">
                    {ticket.id}
                  </span>
                  <h1 className="text-title text-text min-w-0 font-semibold tracking-[-0.01em]">
                    {ticket.title}
                  </h1>
                </div>
                <p className="text-text-2 mt-1.5 text-[13px]">
                  Opened by {submitter?.fullName} · {ticket.category} ·{" "}
                  {openedLabel}
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <Overline>Description</Overline>
            <p className="text-text mt-2.5 text-[14px] leading-6 whitespace-pre-line">
              {ticket.description}
            </p>
          </Panel>

          {showResolution ? (
            <Panel>
              <div className="flex items-center justify-between">
                <Overline>Resolution notes</Overline>
                {notesEditable ? (
                  <span className="text-text-muted text-[12px]">
                    Saved with the fix
                  </span>
                ) : null}
              </div>
              {notesEditable ? (
                <Textarea
                  className="mt-2.5"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Record how you fixed it. This becomes the raw material for a Knowledge Base article."
                />
              ) : notes ? (
                <p className="text-text mt-2.5 text-[14px] leading-6 whitespace-pre-line">
                  {notes}
                </p>
              ) : (
                <p className="text-text-muted mt-2.5 text-[14px]">
                  No resolution notes yet.
                </p>
              )}
            </Panel>
          ) : null}

          <Panel>
            <Overline>Activity</Overline>
            <div className="mt-3 flex flex-col gap-3.5">
              {events.map((event) => {
                const actor = getProfile(event.actorId);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-2.5 text-[13px]"
                  >
                    <Avatar name={actor?.fullName ?? "?"} size={20} />
                    <p className="text-text-2">
                      <span className="text-text font-medium">
                        {actor?.fullName}
                      </span>{" "}
                      {event.action}{" "}
                      <span className="text-text-muted">
                        · {event.timeLabel}
                      </span>
                    </p>
                  </div>
                );
              })}
              {comments.map((comment) => {
                const author = getProfile(comment.authorId);
                return (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar name={author?.fullName ?? "?"} size={20} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px]">
                        <span className="text-text font-medium">
                          {author?.fullName}
                        </span>{" "}
                        <span className="text-text-muted">
                          · {comment.timeLabel}
                        </span>
                      </p>
                      <p className="rounded-card border-border bg-bg text-text mt-1 rounded-tl-none border px-3 py-2 text-[14px] leading-6">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-start gap-2 pt-1">
                <Input
                  className="flex-1"
                  placeholder="Add a comment"
                  aria-label="Add a comment"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") postComment();
                  }}
                />
                <Button onClick={postComment}>Comment</Button>
              </div>
            </div>
          </Panel>
        </div>

        <aside className="flex flex-col gap-4">
          {canWork ? (
            <Panel>
              <div className="flex flex-col gap-3">
                <div>
                  <Overline>Status</Overline>
                  <Select
                    className="mt-2 w-full"
                    options={statusOptions}
                    value={status}
                    onValueChange={(value) => setStatus(value as TicketStatus)}
                  />
                </div>
                {status === "resolved" ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => advance("closed", `${ticket.id} closed`)}
                    >
                      Close ticket
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() =>
                        advance("in_progress", `${ticket.id} reopened`)
                      }
                    >
                      <RotateCcw className="size-4" strokeWidth={1.5} />
                      Reopen
                    </Button>
                  </>
                ) : status === "closed" ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      advance("in_progress", `${ticket.id} reopened`)
                    }
                  >
                    <RotateCcw className="size-4" strokeWidth={1.5} />
                    Reopen
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => advance("resolved", `${ticket.id} resolved`)}
                  >
                    Mark resolved
                  </Button>
                )}
              </div>
            </Panel>
          ) : assignedToId === null ? (
            <Panel>
              <Button className="w-full" onClick={claim}>
                Claim this ticket
              </Button>
              <p className="text-text-muted mt-2 text-[12px] leading-[18px]">
                Pick it up and it becomes yours to work. Anyone in the cohort
                can claim an open ticket.
              </p>
            </Panel>
          ) : null}

          <Panel>
            <div className="flex flex-col gap-3">
              {isAdmin ? (
                <>
                  <div>
                    <Overline>Assignee</Overline>
                    <div className="rounded-control border-border bg-bg text-text mt-2 flex h-9 items-center border px-3 text-[14px]">
                      <AssigneeValue id={assignedToId} />
                    </div>
                  </div>
                  <div>
                    <Overline>Priority</Overline>
                    <Select
                      className="mt-2 w-full"
                      options={priorityOptions}
                      defaultValue={ticket.priority}
                    />
                  </div>
                  <div>
                    <Overline>Category</Overline>
                    <Select
                      className="mt-2 w-full"
                      options={categoryOptions}
                      defaultValue={ticket.category}
                    />
                  </div>
                </>
              ) : (
                <>
                  {canWork ? null : (
                    <RailField label="Status">
                      <StatusPill status={status} />
                    </RailField>
                  )}
                  <RailField label="Assignee">
                    <AssigneeValue id={assignedToId} />
                  </RailField>
                  <RailField label="Priority">
                    {PRIORITY_LABELS[ticket.priority]}
                  </RailField>
                  <RailField label="Category">{ticket.category}</RailField>
                </>
              )}
              <div className="border-border flex flex-col gap-2 border-t pt-3">
                <RailField label="Created">
                  <span className="font-mono text-[12px] tabular-nums">
                    {ticket.createdLabel}
                  </span>
                </RailField>
                <RailField label="Updated">
                  <span className="font-mono text-[12px] tabular-nums">
                    {ticket.updatedLabel}
                  </span>
                </RailField>
              </div>
            </div>
          </Panel>

          {isAdmin ? (
            <Panel>
              <PromoteToKbButton ticketId={ticket.id} />
              <p className="text-text-muted mt-2 text-[12px] leading-[18px]">
                Flag a generally useful fix as a candidate article for Learners
                Hub.
              </p>
            </Panel>
          ) : assignedToId && assignedToId !== user.id ? (
            <p className="text-text-muted px-1 text-[12px] leading-[18px]">
              Claimed by {getProfile(assignedToId)?.fullName}. You can add
              comments any time.
            </p>
          ) : null}
        </aside>
      </div>
    </>
  );
}
