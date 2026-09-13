// src/components/ui/feedback.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ChevronDown, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/primitives";

// Helper Hook for AAA Focus Trapping (FIXED: Added generic type <T>)
function useFocusTrap<T extends HTMLElement = HTMLDivElement>(isActive: boolean, onEscape: () => void) {
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Save the currently focused element to restore it later
    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape();
        return;
      }

      if (e.key === "Tab") {
        const focusableElements = containerRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) as NodeListOf<HTMLElement>;

        if (!focusableElements || focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Initial focus on the first element
    const focusable = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable && focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus when unmounted/closed
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, onEscape]);

  return containerRef;
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: React.PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>) {
  // Use HTMLDivElement for <motion.div>
  const modalRef = useFocusTrap<HTMLDivElement>(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-ink/40 fixed inset-0 z-50 grid place-items-center p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 15, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            className="bg-paper w-full max-w-lg rounded-2xl p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="editorial text-2xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="hover:bg-soft focus-visible:ring-signal rounded-lg p-2 focus-visible:ring-2 focus-visible:outline-none"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ open, onClose, children }: React.PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  // FIXED: Use standard HTMLElement for <motion.aside>
  const drawerRef = useFocusTrap<HTMLElement>(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close drawer overlay"
            className="bg-ink/30 fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="bg-paper fixed top-0 right-0 z-50 h-full w-full max-w-sm overflow-y-auto p-6 shadow-2xl"
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Accordion({ items }: { items: Array<{ title: string; content: string }> }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="border-line divide-y border-y">
      {items.map((item, index) => (
        <div key={item.title}>
          <button
            className="text-ink hover:text-signal focus-visible:ring-signal flex w-full items-center justify-between rounded-sm py-4 text-left text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setActive(active === index ? null : index)}
            aria-expanded={active === index}
          >
            {item.title}
            <ChevronDown
              className={cn("transition-transform duration-200", active === index && "rotate-180")}
              size={17}
            />
          </button>
          <AnimatePresence>
            {active === index && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="text-muted overflow-hidden pb-4 text-sm leading-6"
              >
                {item.content}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function Tabs({ tabs }: { tabs: string[] }) {
  const [active, setActive] = useState(tabs[0]);

  return (
    <div role="tablist" className="border-line scrollbar-hide flex gap-1 overflow-x-auto border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={active === tab}
          onClick={() => setActive(tab)}
          className={cn(
            "focus-visible:ring-signal shrink-0 rounded-t-sm border-b-2 px-3 py-2 text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none",
            active === tab
              ? "border-signal text-signal"
              : "text-muted hover:text-ink hover:border-line border-transparent",
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function Pagination({ current = 1, total = 5 }: { current?: number; total?: number }) {
  return (
    <nav aria-label="Pagination Navigation" className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          aria-current={current === i + 1 ? "page" : undefined}
          className={cn(
            "focus-visible:ring-signal grid h-8 w-8 place-items-center rounded-lg text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none",
            current === i + 1
              ? "bg-ink text-paper"
              : "text-ink hover:bg-soft hover:border-line border border-transparent",
          )}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );
}

export function Carousel({ children }: { children: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  const move = (next: number) => {
    setActive(next);
    track.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  return (
    <div className="overflow-hidden">
      <div ref={track} className="scrollbar-hide flex snap-x snap-mandatory overflow-x-hidden scroll-smooth">
        {children.map((child, index) => (
          <div className="w-full shrink-0 snap-start" key={index}>
            {child}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => move(Math.max(0, active - 1))} disabled={active === 0}>
          Previous
        </Button>
        <p className="text-muted text-xs font-bold">
          {active + 1} / {children.length}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => move(Math.min(children.length - 1, active + 1))}
          disabled={active === children.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function Toast({ message, open, onClose }: { message: string; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-ink text-paper fixed bottom-5 left-1/2 z-70 -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-lg bg-slate-200 motion-safe:animate-pulse dark:bg-slate-800", className)} />;
}

export function LoadingSpinner() {
  return <LoaderCircle aria-label="Loading" className="text-signal motion-safe:animate-spin" />;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "New stories will appear here soon.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="border-line bg-soft rounded-xl border border-dashed p-8 text-center">
      <p className="text-ink font-bold">{title}</p>
      <p className="text-muted mt-1 text-sm">{description}</p>
    </div>
  );
}

export function ErrorState({ title = "Something went wrong" }: { title?: string }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
    >
      <AlertCircle className="text-signal shrink-0" size={19} />
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1">Please refresh the page or try again later.</p>
      </div>
    </div>
  );
}
