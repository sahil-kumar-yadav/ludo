import { getInitialTokens } from "../tokens";

export function resetGame(set) {
  return () => {
    set({
      tokens: getInitialTokens(),
      currentPlayer: 0,
      dice: null,
      rolling: false,
      sixStreak: 0,
    });
  };
}