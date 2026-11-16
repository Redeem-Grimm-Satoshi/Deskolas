"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { createTicket } from "@/app/(app)/actions";
import { useSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  PRIORITY_LABELS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  type TicketPriority,
} from "@/lib/tickets";
import { newTicketSchema } from "@/lib/validations/ticket";

const categoryOptions = TICKET_CATEGORIES.map((value) => ({
  value,
  label: value,
}));
const priorityOptions = TICKET_PRIORITIES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

type Errors = Partial<Record<"title" | "description" | "category", string>>;

type Draft = {
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
};

const EMPTY_DRAFT: Draft = {
  title: "",
  description: "",
  category: "",
  priority: "low",
};

// The draft lives on the button, not the dialog, so closing the dialog (Escape,
// clicking outside, Cancel) keeps whatever was typed. Only a successful submit
// clears it.
export function NewTicketButton() {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(EMPTY_DRAFT);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" strokeWidth={1.5} />
        New ticket
      </Button>
      <NewTicketDialog
        open={open}
        onOpenChange={setOpen}
        draft={draft}
        onDraftChange={setDraft}
        onSubmitted={() => setDraft(EMPTY_DRAFT)}
      />
    </>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  onSubmitted: () => void;
}) {
  const { user } = useSession();
  const toast = useToast();
  const router = useRouter();

  const { title, description, category, priority } = draft;
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  function patch(changes: Partial<Draft>) {
    onDraftChange({ ...draft, ...changes });
  }

  async function handleSubmit() {
    const result = newTicketSchema.safeParse({
      title,
      description,
      category,
      priority,
    });

    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field === "title" || field === "description") {
          next[field] ??= issue.message;
        } else if (field === "category") {
          next.category ??= "Pick the area this falls under.";
        }
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const outcome = await createTicket(result.data);
    setSubmitting(false);

    if (outcome.error) {
      toast({ message: outcome.error });
      return;
    }

    toast({
      tone: "success",
      message: `Ticket ${outcome.reference} submitted`,
    });
    setErrors({});
    onSubmitted();
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setErrors({});
        onOpenChange(next);
      }}
      title="New ticket"
      description={
        <>
          Opening as{" "}
          <span className="text-text font-medium">{user.fullName}</span>. Be
          specific so it can be picked up fast.
        </>
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={submitting}>
            Open ticket
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          fieldSize="dialog"
          placeholder="Short summary of the problem"
          value={title}
          onChange={(event) => patch({ title: event.target.value })}
          error={errors.title}
        />
        <Textarea
          label="Description"
          placeholder="What happened, what you expected, and what you have already tried"
          value={description}
          onChange={(event) => patch({ description: event.target.value })}
          error={errors.description}
          className="min-h-24"
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            fieldSize="dialog"
            placeholder="Select"
            options={categoryOptions}
            value={category}
            onValueChange={(value) => patch({ category: value })}
          />
          <Select
            label="Priority"
            fieldSize="dialog"
            options={priorityOptions}
            value={priority}
            onValueChange={(value) =>
              patch({ priority: value as TicketPriority })
            }
          />
        </div>
        {errors.category ? (
          <p className="text-prio-high -mt-2 text-[13px] leading-[18px]">
            {errors.category}
          </p>
        ) : null}
      </div>
    </Dialog>
  );
}
