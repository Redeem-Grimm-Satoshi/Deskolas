"use client";

import { ChevronLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  addComment,
  claimTicket,
  promoteTicket,
  reassignTicket,
  resolveTicket,
  setTicketStatus,
  updateTicketMeta,
} from "@/app/(app)/actions";
import { NotificationsBell } from "@/components/app/notifications-bell";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { BookOpen, Check, ExternalLink } from "lucide-react";
import { dateTimeLabel, relativeTime } from "@/lib/format";
import type { CommentView, TicketView } from "@/lib/queries";
import { SPINE_CLASS } from "@/lib/ticket-view";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type Role,
  type TicketStatus,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

const PRIO_DOT = {
  low: "bg-prio-low",
  medium: "bg-prio-medium",
  high: "bg-prio-high",
} as const;

const UNASSIGNED = "unassigned";
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

export function TicketDetail({
  ticket,
  comments,
  profiles,
  role,
  currentUserId,
}: {
  ticket: TicketView;
  comments: CommentView[];
  profiles: { id: string; fullName: string; avatarUrl: string | null }[];
  role: Role;
  currentUserId: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const isAdmin = role === "admin";

  const [status, setStatus] = React.useState<TicketStatus>(ticket.status);
  const [assigneeId, setAssigneeId] = React.useState<string | null>(
    ticket.assigneeId,
  );
  const [notes, setNotes] = React.useState(ticket.resolutionNotes ?? "");
  const [draft, setDraft] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [promoteOpen, setPromoteOpen] = React.useState(false);
  const [includeNotes, setIncludeNotes] = React.useState(true);

  const canWork = isAdmin || assigneeId === currentUserId;
  const showResolution =
    canWork || status === "resolved" || status === "closed";
  const notesEditable =
    canWork && (status === "new" || status === "in_progress");

  async function run(action: Promise<{ error?: string }>, ok?: string) {
    setBusy(true);
    const result = await action;
    setBusy(false);
    if (result.error) {
      toast({ message: result.error });
      return false;
    }
    if (ok) toast({ message: ok });
    router.refresh();
    return true;
  }

  async function changeStatus(next: TicketStatus, message: string) {
    setStatus(next);
    await run(setTicketStatus(ticket.id, next), message);
  }

  async function claim() {
    setStatus((s) => (s === "new" ? "in_progress" : s));
    setAssigneeId(currentUserId);
    await run(claimTicket(ticket.id), `You claimed ${ticket.reference}`);
  }

  async function resolve() {
    setStatus("resolved");
    await run(resolveTicket(ticket.id, notes), `${ticket.reference} resolved`);
  }

  async function reassign(value: string) {
    const next = value === UNASSIGNED ? null : value;
    setAssigneeId(next);
    await run(
      reassignTicket(ticket.id, next),
      next
        ? `Assigned to ${profiles.find((p) => p.id === next)?.fullName}`
        : `${ticket.reference} unassigned`,
    );
  }

  async function postComment() {
    if (!draft.trim()) return;
    const ok = await run(addComment(ticket.id, draft));
    if (ok) setDraft("");
  }

  const assigneeProfile = assigneeId
    ? profiles.find((p) => p.id === assigneeId)
    : undefined;
  const assigneeName = assigneeId
    ? (assigneeProfile?.fullName ?? "Unknown")
    : null;
  const assigneeOptions = [
    { value: UNASSIGNED, label: "Unassigned" },
    ...profiles.map((p) => ({ value: p.id, label: p.fullName })),
  ];

  return (
    <>
      <header className="border-border bg-bg sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-6 max-sm:px-4">
        <Link
          href="/tickets"
          className="text-text-2 hover:text-text flex items-center gap-1.5 text-[14px] transition-colors"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
          Tickets
        </Link>
        <span className="text-text-muted font-mono text-[13px]">
          / {ticket.reference}
        </span>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <NotificationsBell />
        </div>
      </header>

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
                    {ticket.reference}
                  </span>
                  <h1 className="text-title text-text min-w-0 font-semibold tracking-[-0.01em]">
                    {ticket.title}
                  </h1>
                </div>
                <p className="text-text-2 mt-1.5 text-[13px]">
                  Opened by {ticket.submitterName} · {ticket.category} ·{" "}
                  {relativeTime(ticket.createdAt)}
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
              <div className="flex items-center gap-2.5 text-[13px]">
                <Avatar
                  name={ticket.submitterName}
                  src={ticket.submitterAvatarUrl}
                  size={20}
                />
                <p className="text-text-2">
                  <span className="text-text font-medium">
                    {ticket.submitterName}
                  </span>{" "}
                  opened this ticket{" "}
                  <span className="text-text-muted">
                    · {relativeTime(ticket.createdAt)}
                  </span>
                </p>
              </div>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <Avatar
                    name={comment.authorName}
                    src={comment.authorAvatarUrl}
                    size={20}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px]">
                      <span className="text-text font-medium">
                        {comment.authorName}
                      </span>{" "}
                      <span
                        className="text-text-muted"
                        title={comment.timeTitle}
                      >
                        · {comment.timeLabel}
                      </span>
                    </p>
                    <p className="rounded-card border-border bg-bg text-text mt-1 rounded-tl-none border px-3 py-2 text-[14px] leading-6">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
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
                <Button onClick={postComment} disabled={busy}>
                  Comment
                </Button>
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
                    onValueChange={(value) =>
                      changeStatus(
                        value as TicketStatus,
                        `${ticket.reference} set to ${STATUS_LABELS[value as TicketStatus].toLowerCase()}`,
                      )
                    }
                  />
                </div>
                {status === "resolved" ? (
                  <>
                    <Button
                      className="w-full"
                      disabled={busy}
                      onClick={() =>
                        changeStatus("closed", `${ticket.reference} closed`)
                      }
                    >
                      Close ticket
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={busy}
                      onClick={() =>
                        changeStatus(
                          "in_progress",
                          `${ticket.reference} reopened`,
                        )
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
                    disabled={busy}
                    onClick={() =>
                      changeStatus(
                        "in_progress",
                        `${ticket.reference} reopened`,
                      )
                    }
                  >
                    <RotateCcw className="size-4" strokeWidth={1.5} />
                    Reopen
                  </Button>
                ) : (
                  <Button className="w-full" disabled={busy} onClick={resolve}>
                    Mark resolved
                  </Button>
                )}
              </div>
            </Panel>
          ) : assigneeId === null ? (
            <Panel>
              <Button className="w-full" disabled={busy} onClick={claim}>
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
                    <Select
                      className="mt-2 w-full"
                      options={assigneeOptions}
                      value={assigneeId ?? UNASSIGNED}
                      onValueChange={reassign}
                    />
                  </div>
                  <div>
                    <Overline>Priority</Overline>
                    <Select
                      className="mt-2 w-full"
                      options={priorityOptions}
                      value={ticket.priority}
                      onValueChange={(value) =>
                        run(updateTicketMeta(ticket.id, { priority: value }))
                      }
                    />
                  </div>
                  <div>
                    <Overline>Category</Overline>
                    <Select
                      className="mt-2 w-full"
                      options={categoryOptions}
                      value={ticket.category}
                      onValueChange={(value) =>
                        run(updateTicketMeta(ticket.id, { category: value }))
                      }
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
                    {assigneeName ? (
                      <span className="flex items-center gap-1.5">
                        <Avatar
                          name={assigneeName}
                          src={assigneeProfile?.avatarUrl}
                          size={18}
                        />
                        {assigneeName}
                      </span>
                    ) : (
                      <span className="text-text-muted">Unassigned</span>
                    )}
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
                    {dateTimeLabel(ticket.createdAt)}
                  </span>
                </RailField>
                <RailField label="Updated">
                  <span className="font-mono text-[12px] tabular-nums">
                    {relativeTime(ticket.updatedAt)}
                  </span>
                </RailField>
              </div>
            </div>
          </Panel>

          {isAdmin ? (
            <Panel>
              {ticket.kbUrl ? (
                <>
                  <a
                    href={ticket.kbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-text flex items-center gap-2 text-[14px] font-medium"
                  >
                    <BookOpen className="size-4" strokeWidth={1.5} />
                    View in Knowledge Base
                    <ExternalLink className="size-3.5" strokeWidth={1.5} />
                  </a>
                  <p className="text-text-muted mt-2 text-[12px] leading-[18px]">
                    Learners Hub published this fix as an article.
                  </p>
                </>
              ) : ticket.kbSubmittedAt ? (
                <>
                  <p className="text-text flex items-center gap-2 text-[14px] font-medium">
                    <Check
                      className="text-st-resolved size-4"
                      strokeWidth={2}
                    />
                    Sent to Learners Hub
                  </p>
                  <p className="text-text-muted mt-2 text-[12px] leading-[18px]">
                    Waiting for the Learners Hub team to review and publish.
                  </p>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="w-full"
                    disabled={status !== "resolved" && status !== "closed"}
                    onClick={() => setPromoteOpen(true)}
                  >
                    <BookOpen className="size-4" strokeWidth={1.5} />
                    {ticket.isCandidate
                      ? "Retry Learners Hub handoff"
                      : "Promote to Knowledge Base"}
                  </Button>
                  <p className="text-text-muted mt-2 text-[12px] leading-[18px]">
                    {status === "resolved" || status === "closed"
                      ? "Send a generally useful fix to Learners Hub as a candidate article."
                      : "Resolve this ticket to send it to the Knowledge Base."}
                  </p>
                </>
              )}
            </Panel>
          ) : assigneeId && assigneeId !== currentUserId ? (
            <p className="text-text-muted px-1 text-[12px] leading-[18px]">
              Claimed by {assigneeName}. You can add comments any time.
            </p>
          ) : null}
        </aside>
      </div>

      <Dialog
        open={promoteOpen}
        onOpenChange={setPromoteOpen}
        title="Promote to Knowledge Base?"
        description={
          <>
            This flags the fix on{" "}
            <span className="text-text font-mono">{ticket.reference}</span> as a
            candidate article and shares it with the Learners Hub team. They
            review and publish.
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setPromoteOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                const ok = await run(
                  promoteTicket(ticket.id, { includeNotes }),
                  `${ticket.reference} sent to the Learners Hub team`,
                );
                if (ok) setPromoteOpen(false);
              }}
            >
              Promote
            </Button>
          </>
        }
      >
        <label className="rounded-control border-border bg-bg text-text flex cursor-pointer items-center gap-3 border px-3.5 py-3 text-[14px] font-medium">
          <Checkbox checked={includeNotes} onCheckedChange={setIncludeNotes} />
          Include the resolution notes
        </label>
      </Dialog>
    </>
  );
}
