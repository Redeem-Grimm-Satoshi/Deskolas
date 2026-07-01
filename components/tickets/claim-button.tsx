"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { claimTicket } from "@/app/(app)/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ClaimButton({
  ticketId,
  reference,
}: {
  ticketId: string;
  reference: string;
}) {
  const [pending, setPending] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      loading={pending}
      onClick={async () => {
        setPending(true);
        const result = await claimTicket(ticketId);
        setPending(false);
        toast({ message: result.error ?? `${reference} assigned to you` });
        router.refresh();
      }}
    >
      Assign to me
    </Button>
  );
}
