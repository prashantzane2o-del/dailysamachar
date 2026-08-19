"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function MegaMenu({ label, groups }: { label: string; groups: Array<{ title: string; links: string[] }> }) { const [open, setOpen] = useState(false); return <div className="relative"><button className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-ink" onClick={() => setOpen(!open)} aria-expanded={open}>{label}<ChevronDown size={13}/></button><AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute left-0 top-7 z-50 grid w-[32rem] grid-cols-3 gap-6 rounded-xl border bg-paper p-5 shadow-2xl">{groups.map(group => <div key={group.title}><p className="kicker">{group.title}</p>{group.links.map(link => <a href="#section" className="mt-3 block text-sm font-semibold hover:text-signal" key={link}>{link}</a>)}</div>)}</motion.div>}</AnimatePresence></div>; }
