import { z } from "zod";

import { TICKET_CATEGORIES, TICKET_PRIORITIES } from "@/lib/tickets";

// Shared by the client form and (in Phase 2) the server action, so the same
// rules validate on both sides. Messages say what to do, in one line.
export const newTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Add a short title so people know what is wrong.")
    .max(120, "Keep the title under 120 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Describe what happened and what you have already tried."),
  category: z.enum(TICKET_CATEGORIES),
  priority: z.enum(TICKET_PRIORITIES),
});

export type NewTicketInput = z.infer<typeof newTicketSchema>;
