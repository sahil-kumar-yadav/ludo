"use client";
import { useGameStore } from "../store/gameStore";
import { motion } from "framer-motion";
import clsx from "classnames";

export default function Dice() {
  const { rollDice, dice, rolling } = useGameStore();

  // Dice pip positions (1–6)
  const pipLayout = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [0, 2], [2, 0], [2, 2]],
    5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
    6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Roll Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={rolling}
        onClick={rollDice}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
                   text-white font-bold shadow-md hover:shadow-lg 
                   transition disabled:opacity-50"
      >
        🎲 Roll Dice
      </motion.button>

      {/* Dice Display */}
      <motion.div
        key={rolling ? "rolling" : dice}
        initial={{ rotate: 0, scale: 0.8 }}
        animate={
          rolling
            ? { rotate: 720, scale: [1, 1.2, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={clsx(
          "w-20 h-20 rounded-2xl shadow-xl border-2 flex items-center justify-center",
          "bg-gradient-to-br from-white to-gray-100 relative"
        )}
      >
        {rolling ? (
          <span className="text-3xl animate-bounce">…</span>
        ) : dice ? (
          <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-3">
            {pipLayout[dice].map(([r, c], i) => (
              <div
                key={i}
                className="w-3 h-3 bg-black rounded-full"
                style={{
                  gridRow: r + 1,
                  gridColumn: c + 1,
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              />
            ))}
          </div>
        ) : (
          <span className="text-xl text-gray-500">?</span>
        )}
      </motion.div>
    </div>
  );
}
