"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function MegaMenu({ label, groups }: { label: string; groups: Array<{ title: string; links: string[] }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="hover:text-ink inline-flex items-center gap-1 text-xs font-bold text-slate-600"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={13} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="bg-paper absolute top-7 left-0 z-50 grid w-lg grid-cols-3 gap-6 rounded-xl border p-5 shadow-2xl"
          >
            {groups.map((group) => (
              <div key={group.title}>
                <p className="kicker">{group.title}</p>
                {group.links.map((link) => (
                  <Link
                    href={`/category/${encodeURIComponent(link.toLowerCase().trim().replace(/\s+/g, "-"))}`}
                    className="hover:text-signal mt-3 block text-sm font-semibold"
                    key={link}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
