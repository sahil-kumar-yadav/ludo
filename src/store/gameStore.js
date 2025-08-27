import { create } from "zustand";
import { initialPlayers } from "./game/initialPlayers";
import { getInitialTokens } from "./tokens";
import { rollDice } from "./game/rollDice";
import { getLegalMoves } from "./game/getLegalMoves";
import { moveToken } from "./game/moveToken";
import { resetGame } from "./game/resetGame";

export const useGameStore = create((set, get) => ({
  players: initialPlayers,
  tokens: getInitialTokens(),
  currentPlayer: 0,
  dice: null,
  rolling: false,
  sixStreak: 0,
  animating: false,

  rollDice: rollDice(set, get),
  getLegalMoves: getLegalMoves(get),
  moveToken: moveToken(set, get),
  reset: resetGame(set),
}));