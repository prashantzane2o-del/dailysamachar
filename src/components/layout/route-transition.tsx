"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      className="flex-1"
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
