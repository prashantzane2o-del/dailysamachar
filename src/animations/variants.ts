import type { Variants } from "framer-motion";
export const reveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
export const overlay: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
