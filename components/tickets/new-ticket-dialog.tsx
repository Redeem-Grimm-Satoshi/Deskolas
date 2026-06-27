"use client";

import { Plus } from "lucide-react";
import * as React from "react";

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

export function NewTicketButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" strokeWidth={1.5} />
        New ticket
      </Button>
      <NewTicketDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useSession();
  const toast = useToast();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState<TicketPriority>("low");
  const [errors, setErrors] = React.useState<Errors>({});

  function reset() {
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("low");
    setErrors({});
  }

  function handleSubmit() {
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

    toast({ tone: "success", message: "Ticket PS-0012 submitted" });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
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
          <Button onClick={handleSubmit}>Open ticket</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          fieldSize="dialog"
          placeholder="Short summary of the problem"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />
        <Textarea
          label="Description"
          placeholder="What happened, what you expected, and what you have already tried"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
            onValueChange={setCategory}
          />
          <Select
            label="Priority"
            fieldSize="dialog"
            options={priorityOptions}
            value={priority}
            onValueChange={(value) => setPriority(value as TicketPriority)}
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
