"use client";

import { ChevronDown, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button, Input } from "@/shared/ui/primitives";
import { cn } from "@/shared/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "bg-paper focus:border-signal focus-visible:ring-focus-ring min-h-28 w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-4",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "text-signal inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  active = false,
  onClick,
}: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "hover:border-signal hover:text-signal rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active && "border-signal bg-signal text-white hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

export function Avatar({ name, src, size = "md" }: { name: string; src?: string; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return src ? (
    <Image className={cn("rounded-full object-cover", dimensions)} src={src} alt="" width={48} height={48} />
  ) : (
    <span
      aria-label={name}
      className={cn("bg-ink grid place-items-center rounded-full font-bold text-white", dimensions)}
    >
      {name
        .split(" ")
        .map((word) => word[0])
        .join("")}
    </span>
  );
}

export function Tooltip({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="bg-ink pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

export function SearchBox({ onClose, defaultValue }: { onClose?: () => void; defaultValue?: string }) {
  return (
    <div className="bg-paper flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm">
      <Search size={18} className="text-signal" />
      <Input
        name="q"
        defaultValue={defaultValue}
        aria-label="Search DailySamachar"
        placeholder="Search stories, topics and people"
        className="border-0 bg-transparent p-0 shadow-none focus:ring-0"
      />
      {onClose && (
        <Button variant="ghost" size="sm" aria-label="Close search" onClick={onClose}>
          <X size={17} />
        </Button>
      )}
    </div>
  );
}

export function Dropdown({ label, items }: { label: string; items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} aria-expanded={open}>
        {label}
        <ChevronDown size={14} className="ml-1" />
      </Button>
      {open && (
        <div className="bg-paper absolute top-full right-0 z-40 mt-2 w-44 rounded-xl border p-1 shadow-xl">
          {items.map((item) => (
            <button
              type="button"
              className="hover:bg-soft block w-full rounded-lg px-3 py-2 text-left text-sm"
              onClick={() => setOpen(false)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
