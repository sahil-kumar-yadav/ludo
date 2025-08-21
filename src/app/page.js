"use client";
import LudoBoard from "@/components/LudoBoard";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const { currentPlayer, dice, rollDice, nextTurn, reset } = useGameStore();
  return (
     <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎲 Ludo Game</h1>
      <LudoBoard />
    </main>
  );
}
