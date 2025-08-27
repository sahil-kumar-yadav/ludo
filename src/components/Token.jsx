"use client";
import { motion } from "framer-motion";
import clsx from "classnames";

export default function Token({ color, index, canMove, onClick, children }) {
  const COLORS = {
    red: "from-red-600 to-red-800 border-red-900 text-white",
    green: "from-green-600 to-green-800 border-green-900 text-white",
    yellow: "from-yellow-300 to-yellow-500 border-yellow-700 text-black",
    blue: "from-blue-600 to-blue-800 border-blue-900 text-white",
  };

  return (
    <motion.div
      className={clsx(
        "relative w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold select-none",
        "bg-gradient-to-t shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]",
        "border-2 ring-1 ring-black/20 shadow-md",
        COLORS[color],
        canMove &&
          "cursor-pointer shadow-lg ring-2 ring-yellow-400/70 animate-pulse"
      )}
      whileHover={canMove ? { scale: 1.2, rotate: 2 } : {}}
      whileTap={canMove ? { scale: 0.9, rotate: -2 } : {}}
      onClick={canMove ? onClick : undefined}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    >
      {/* Glossy highlight overlay */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
