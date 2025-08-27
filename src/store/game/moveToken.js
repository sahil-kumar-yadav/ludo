import { makeToken } from "../tokens";
import { isStartBlocked, isSafeSquare, isHomeColumn } from "../gameHelpers";
import { getColorPath } from "@/lib/board";
import { sameCoord } from "@/lib/board-constants";

export function moveToken(set, get) {
  return (color, index) => {
    const { dice, tokens, currentPlayer, players, sixStreak, animating } = get();
    if (!dice) return;
    if (animating) return;

    const player = players[currentPlayer];
    if (player.color !== color) return;

    const path = getColorPath(color);
    const token = tokens[color][index];
    if (!token) return;

    const fromHome = !!token.inHome;
    let startPos = token.inHome ? null : token.pos;
    if (!fromHome && (startPos === null || startPos === undefined)) return;

    if (fromHome) {
      if (dice !== 6 || isStartBlocked(tokens, color)) return;
    }

    const finalPos = fromHome ? 0 : startPos + dice;
    if (finalPos > path.length - 1) return;

    const stepFrom = fromHome ? 0 : startPos + 1;
    const stepTo = finalPos;
    if (stepTo >= path.length - 6) {
      for (let s = stepFrom; s < stepTo; s++) {
        if (
          tokens[color].some(
            (other, j) => j !== index && other.pos === s && !other.inHome && !other.finished
          )
        ) {
          return;
        }
      }
    }

    for (const clr of Object.keys(tokens)) {
      const occ = tokens[clr].filter(
        (t, j) => !t.inHome && !t.finished && t.pos === finalPos
      ).length;
      if (clr !== color && occ >= 2) {
        return;
      }
    }

    set({ animating: true });

    const stepDelay = 300;

    if (fromHome) {
      setTimeout(() => {
        set((state) => {
          const updated = {
            ...state.tokens,
            [color]: state.tokens[color].map((t, i) =>
              i === index ? { ...t, inHome: false, pos: 0, finished: false } : t
            ),
          };
          return { tokens: updated };
        });
        setTimeout(() => finishMove(0), stepDelay);
      }, 120);
      return;
    }

    let currentStep = startPos + 1;
    const animateStep = (step) => {
      set((state) => {
        const updated = {
          ...state.tokens,
          [color]: state.tokens[color].map((t, i) =>
            i === index ? { ...t, inHome: false, pos: step, finished: false } : t
          ),
        };
        return { tokens: updated };
      });

      if (step < finalPos) {
        setTimeout(() => animateStep(step + 1), stepDelay);
      } else {
        setTimeout(() => finishMove(step), stepDelay / 2);
      }
    };

    function finishMove(pos) {
      set((state) => {
        const updatedTokens = { ...state.tokens };

        const movedToken = {
          ...updatedTokens[color][index],
          pos,
          inHome: false,
          finished: pos === path.length - 1,
        };
        updatedTokens[color] = updatedTokens[color].map((t, i) =>
          i === index ? movedToken : t
        );

        let captured = false;
        if (!movedToken.inHome && !movedToken.finished) {
          const landingCoord = path[pos];
          for (const other of state.players) {
            if (other.color === color) continue;
            const oppPath = getColorPath(other.color);
            updatedTokens[other.color] = updatedTokens[other.color].map((t) => {
              if (t.inHome || t.finished || t.pos == null) return t;
              const oppCoord = oppPath[t.pos];
              if (
                sameCoord(oppCoord, landingCoord) &&
                !isSafeSquare(landingCoord, color) &&
                !isHomeColumn(landingCoord, other.color)
              ) {
                captured = true;
                return makeToken();
              }
              return t;
            });
          }
        }

        let nextSixStreak = state.dice === 6 ? state.sixStreak + 1 : 0;
        let nextPlayer = state.currentPlayer;

        if (nextSixStreak >= 3) {
          nextPlayer = (state.currentPlayer + 1) % state.players.length;
          nextSixStreak = 0;
        } else if (!(state.dice === 6 || captured)) {
          nextPlayer = (state.currentPlayer + 1) % state.players.length;
          nextSixStreak = 0;
        }

        return {
          tokens: updatedTokens,
          dice: null,
          currentPlayer: nextPlayer,
          sixStreak: nextSixStreak,
          animating: false,
        };
      });
    }

    animateStep(currentStep);
  };
}