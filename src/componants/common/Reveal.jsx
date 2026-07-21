import React from "react";
import { motion } from "framer-motion";

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Used to give the home rails a gentle, staggered arrival instead of snapping in
 * all at once. Honours reduced-motion by rendering statically.
 */
const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const Reveal = ({ children, y = 28, delay = 0 }) => {
  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
