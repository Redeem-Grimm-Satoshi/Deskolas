"use client";

import { BookOpen } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export function PromoteToKbButton({ ticketId }: { ticketId: string }) {
  const [open, setOpen] = React.useState(false);
  const [includeNotes, setIncludeNotes] = React.useState(true);
  const toast = useToast();
  const checkboxId = React.useId();

  return (
    <>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <BookOpen className="size-4" strokeWidth={1.5} />
        Promote to Knowledge Base
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Promote to Knowledge Base?"
        description={
          <>
            This flags the fix on{" "}
            <span className="text-text font-mono">{ticketId}</span> as a
            candidate article and shares it with the Learners Hub team. They
            review and publish.
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ message: `${ticketId} sent to the Learners Hub team` });
                setOpen(false);
              }}
            >
              Promote
            </Button>
          </>
        }
      >
        <label
          htmlFor={checkboxId}
          className="rounded-control border-border bg-bg text-text flex cursor-pointer items-center gap-3 border px-3.5 py-3 text-[14px] font-medium"
        >
          <Checkbox
            id={checkboxId}
            checked={includeNotes}
            onCheckedChange={setIncludeNotes}
          />
          Include the resolution notes
        </label>
      </Dialog>
    </>
  );
}
