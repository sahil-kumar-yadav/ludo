import { create } from "zustand";
import { COLORS, getColorPath, sameCoord, getHomePositions } from "../lib/board";

const initialPlayers = [
  { id: 0, color: COLORS.RED },
  { id: 1, color: COLORS.GREEN },
  { id: 2, color: COLORS.YELLOW },
  { id: 3, color: COLORS.BLUE },
];

function getInitialTokens() {
  return {
    [COLORS.RED]: Array(4).fill({ pos: null, inHome: true, finished: false }),
    [COLORS.GREEN]: Array(4).fill({ pos: null, inHome: true, finished: false }),
    [COLORS.YELLOW]: Array(4).fill({ pos: null, inHome: true, finished: false }),
    [COLORS.BLUE]: Array(4).fill({ pos: null, inHome: true, finished: false }),
  };
}

export const useGameStore = create((set, get) => ({
  players: initialPlayers,
  tokens: getInitialTokens(),
  currentPlayer: 0,
  dice: null,
  rolling: false,
  sixStreak: 0, // counts consecutive 6s for current player

  rollDice: () => {
    const { rolling, sixStreak } = get();
    if (rolling) return;
    set({ rolling: true });
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      set({ dice, rolling: false });

      setTimeout(() => {
        const { getLegalMoves, dice, sixStreak, currentPlayer, players } = get();
        let nextSixStreak = dice === 6 ? sixStreak + 1 : 0;

        // If three consecutive 6s, turn forfeited
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
          // No moves possible, pass turn to next player, reset six streak
          set({
            currentPlayer: (currentPlayer + 1) % players.length,
            sixStreak: 0,
            // dice stays visible until next roll
          });
        } else {
          // If dice is 6, keep sixStreak, else reset
          set({ sixStreak: nextSixStreak });
        }
      }, 100);
    }, 800);
  },

  getLegalMoves: () => {
    const { dice, currentPlayer, players, tokens } = get();
    if (!dice) return [];
    const player = players[currentPlayer];
    const color = player.color;
    const path = getColorPath(color);

    return tokens[color]
      .map((t, i) => {
        if (t.finished) return null;
        // Can enter board from home
        if (t.inHome && dice === 6 && !isStartBlocked(tokens, color, path[0])) return i;
        // On board, can move if not blocked in home column and not overshooting finish
        if (!t.inHome && t.pos !== null) {
          let newPos = t.pos + dice;
          if (newPos > path.length - 1) return null; // must roll exact to finish
          // Home column: can't jump over own tokens
          if (newPos >= path.length - 6) {
            for (let step = t.pos + 1; step < newPos; ++step) {
              if (tokens[color].some((other, j) => j !== i && other.pos === step && !other.inHome && !other.finished)) {
                return null;
              }
            }
          }
          // Can't land on own block (two tokens already there)
          const landingTokens = tokens[color].filter(
            (other, j) => j !== i && other.pos === newPos && !other.inHome && !other.finished
          );
          if (landingTokens.length >= 1) return null;
          return i;
        }
        return null;
      })
      .filter((i) => i !== null);
  },

  moveToken: (color, index) => {
    const { dice, tokens, currentPlayer, players, sixStreak } = get();
    if (!dice) return;

    const player = players[currentPlayer];
    if (player.color !== color) return;

    const path = getColorPath(color);
    const token = tokens[color][index];
    let newToken = { ...token };

    // Move out of home
    if (token.inHome) {
      if (dice === 6 && !isStartBlocked(tokens, color, path[0])) {
        newToken = { pos: 0, inHome: false, finished: false };
      } else {
        return;
      }
    } else {
      let newPos = token.pos + dice;
      if (newPos > path.length - 1) return; // must roll exact to finish

      // Home column: can't jump over own tokens
      if (newPos >= path.length - 6) {
        for (let step = token.pos + 1; step < newPos; ++step) {
          if (tokens[color].some((other, j) => j !== index && other.pos === step && !other.inHome && !other.finished)) {
            return;
          }
        }
      }

      // Can't land on own block
      const landingTokens = tokens[color].filter(
        (other, j) => j !== index && other.pos === newPos && !other.inHome && !other.finished
      );
      if (landingTokens.length >= 1) return;

      // Move token
      newToken = { ...token, pos: newPos };
      // Finish if at end
      if (newPos === path.length - 1) {
        newToken.finished = true;
      }
    }

    // Update tokens
    let updatedTokens = { ...tokens };
    updatedTokens[color] = tokens[color].map((t, i) => (i === index ? newToken : t));

    // Capture logic (not in home column or safe squares)
    if (!newToken.inHome && !newToken.finished) {
      const landingCoord = path[newToken.pos];
      for (let other of players) {
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
            return { pos: null, inHome: true, finished: false }; // send back home
          }
          return t;
        });
      }
    }

    // If dice was 6 and not third consecutive, player gets another turn
    let nextPlayer = currentPlayer;
    let nextSixStreak = dice === 6 ? sixStreak + 1 : 0;
    let nextDice = null;
    if (dice !== 6 || nextSixStreak >= 3) {
      nextPlayer = (currentPlayer + 1) % players.length;
      nextSixStreak = 0;
    }

    set({
      tokens: updatedTokens,
      dice: nextDice,
      currentPlayer: nextPlayer,
      sixStreak: nextSixStreak,
    });
  },

  reset: () => {
    set({
      tokens: getInitialTokens(),
      currentPlayer: 0,
      dice: null,
      rolling: false,
      sixStreak: 0,
    });
  },
}));

// Helpers

function isStartBlocked(tokens, color, startCoord) {
  // Block if two own tokens already at start
  const path = getColorPath(color);
  const startIndex = 0;
  return (
    tokens[color].filter(
      (t) => !t.inHome && !t.finished && t.pos === startIndex
    ).length >= 2
  );
}

function isSafeSquare(coord, color) {
  // You can add your own logic for safe squares (e.g. star squares)
  // For now, only home columns and center are safe
  return isHomeColumn(coord, color) || (coord.r === 7 && coord.c === 7);
}

function isHomeColumn(coord, color) {
  // Home column is last 6 squares of path for each color
  const path = getColorPath(color);
  const idx = path.findIndex((p) => sameCoord(p, coord));
  return idx >= path.length - 6;
}