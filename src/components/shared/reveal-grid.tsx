"use client";

import { motion } from "framer-motion";
import { reveal, stagger } from "@/animations/variants";

export function RevealGrid({ children }: { children: React.ReactNode }) { return <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-7 lg:grid-cols-[1fr_1.85fr_1fr]">{children}</motion.div>; }
export function RevealItem({ children }: { children: React.ReactNode }) { return <motion.div variants={reveal}>{children}</motion.div>; }
