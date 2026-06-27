"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { Check, Info, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Tone = "success" | "neutral";

// The visual, shared by the live toaster and the component showcase. Plain copy,
// no "successfully", no exclamation: the result is the confirmation.
export function ToastCard({
  tone = "neutral",
  message,
  onDismiss,
}: {
  tone?: Tone;
  message: string;
  onDismiss?: () => void;
}) {
  const Icon = tone === "success" ? Check : Info;

  return (
    <div className="rounded-card border-border bg-surface shadow-floating flex w-[340px] max-w-full items-center gap-3 border px-3.5 py-3">
      <Icon
        className={cn(
          "size-[18px] shrink-0",
          tone === "success" ? "text-pill-resolved-text" : "text-text-2",
        )}
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="text-text flex-1 text-[14px] font-medium">
        {message}
      </span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-text-muted hover:text-text shrink-0 transition-colors"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  );
}

type ToastItem = { id: number; tone: Tone; message: string };
type ToastContextValue = (toast: { tone?: Tone; message: string }) => void;

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback<ToastContextValue>(
    ({ tone = "neutral", message }) => {
      nextId += 1;
      setToasts((prev) => [...prev, { id: nextId, tone, message }]);
    },
    [],
  );

  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <RadixToast.Provider duration={4000} swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <RadixToast.Root
            key={item.id}
            onOpenChange={(open) => {
              if (!open) remove(item.id);
            }}
            className="motion-safe:data-[state=open]:animate-[layer-in_200ms_ease-out]"
          >
            <ToastCard
              tone={item.tone}
              message={item.message}
              onDismiss={() => remove(item.id)}
            />
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed right-0 bottom-0 z-50 m-0 flex w-[360px] max-w-[100vw] list-none flex-col gap-2 p-6 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
