export function rollDice(set, get) {
  return () => {
    const { rolling } = get();
    if (rolling) return;

    set({ rolling: true });

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      set({ dice, rolling: false });

      setTimeout(() => {
        const { getLegalMoves, dice, sixStreak, currentPlayer, players } = get();
        let nextSixStreak = dice === 6 ? sixStreak + 1 : 0;

        if (nextSixStreak >= 3) {
          set({
            dice: null,
            currentPlayer: (currentPlayer + 1) % players.length,
            sixStreak: 0,
          });
          return;
        }

        const legalMoves = getLegalMoves();
        if (legalMoves.length === 0) {
          set({
            currentPlayer: (currentPlayer + 1) % players.length,
            sixStreak: 0,
          });
        } else {
          set({ sixStreak: nextSixStreak });
        }
      }, 100);
    }, 800);
  };
}