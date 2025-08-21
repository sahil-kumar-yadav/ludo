"use client";
import { useGameStore } from "../store/gameStore";
import { motion } from "framer-motion";

export default function Dice() {
  const { rollDice, dice, rolling } = useGameStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        disabled={rolling}
        onClick={rollDice}
        className="dice-btn"
      >
        🎲 Roll
      </motion.button>
      <motion.div
        key={dice}
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="dice-display"
      >
        {rolling ? "..." : dice ? `Rolled: ${dice}` : "Roll to start"}
      </motion.div>
    </div>
  );
}
