"use client";
import { motion } from "framer-motion";
import clsx from "classnames";

export default function Token({ color, index, canMove, onClick, children }) {
  const COLORS = {
    red: "from-red-500 to-red-700 border-red-800 text-white",
    green: "from-green-500 to-green-700 border-green-800 text-white",
    yellow: "from-yellow-300 to-yellow-500 border-yellow-600 text-black",
    blue: "from-blue-500 to-blue-700 border-blue-800 text-white",
  };

  return (
    <motion.div
      className={clsx(
        "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold shadow-md border-2 bg-gradient-to-br select-none",
        COLORS[color],
        canMove &&
          "cursor-pointer shadow-lg shadow-yellow-400/70 animate-pulse"
      )}
      whileHover={canMove ? { scale: 1.15 } : {}}
      whileTap={canMove ? { scale: 0.9 } : {}}
      onClick={canMove ? onClick : undefined}
      layout
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
