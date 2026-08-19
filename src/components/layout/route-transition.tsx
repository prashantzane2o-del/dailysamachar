"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <motion.div key={pathname} className="flex-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}
