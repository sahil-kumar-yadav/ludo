"use client";
import { motion } from "framer-motion";

export default function Token({ color, index, canMove, onClick, children }) {
  return (
    <motion.div
      className={`token token-${color} ${canMove ? "highlight" : ""}`}
      whileHover={canMove ? { scale: 1.2 } : {}}
      whileTap={canMove ? { scale: 0.9 } : {}}
      onClick={canMove ? onClick : undefined}
      layout
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
