import { Ticket } from "lucide-react";

// Holding page for the Phase 0 scaffold. The real entry point routes by role
// (admin to dashboard, learner to my tickets) once auth lands in Phase 2.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
      <div className="flex items-center gap-3">
        <span className="bg-accent flex size-9 items-center justify-center rounded-[10px]">
          <Ticket className="size-[18px] text-white" strokeWidth={1.5} />
        </span>
        <span className="text-title text-text">Deskolas</span>
      </div>
      <p className="text-body text-text-2">The cohort help desk.</p>
    </main>
  );
}
