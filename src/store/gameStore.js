import { create } from "zustand";
import { COLORS, getColorPath, sameCoord } from "../lib/board";

const initialPlayers = [
  { id: 0, color: COLORS.RED },
  { id: 1, color: COLORS.GREEN },
  { id: 2, color: COLORS.YELLOW },
  { id: 3, color: COLORS.BLUE },
];

// Token factory
function makeToken() {
  return { pos: null, inHome: true, finished: false };
}

// Reset state for all tokens
function getInitialTokens() {
  return {
    [COLORS.RED]: Array(4).fill(0).map(makeToken),
    [COLORS.GREEN]: Array(4).fill(0).map(makeToken),
    [COLORS.YELLOW]: Array(4).fill(0).map(makeToken),
    [COLORS.BLUE]: Array(4).fill(0).map(makeToken),
  };
}

export const useGameStore = create((set, get) => ({
  players: initialPlayers,
  tokens: getInitialTokens(),
  currentPlayer: 0,
  dice: null,
  rolling: false,
  sixStreak: 0, // counts consecutive 6s for current player

  // 🎲 Roll dice
  rollDice: () => {
    const { rolling } = get();
    if (rolling) return;

    set({ rolling: true });

    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      set({ dice, rolling: false });

      setTimeout(() => {
        const { getLegalMoves, dice, sixStreak, currentPlayer, players } = get();
        let nextSixStreak = dice === 6 ? sixStreak + 1 : 0;

        // ⚠️ Three 6s in a row → turn skipped
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
          // No moves → pass turn
          set({
            currentPlayer: (currentPlayer + 1) % players.length,
            sixStreak: 0,
          });
        } else {
          // Otherwise continue (reset streak only if not 6)
          set({ sixStreak: nextSixStreak });
        }
      }, 100);
    }, 800);
  },

  // ✅ Check possible moves for current player
  getLegalMoves: () => {
    const { dice, currentPlayer, players, tokens } = get();
    if (!dice) return [];

    const player = players[currentPlayer];
    const color = player.color;
    const path = getColorPath(color);

    return tokens[color]
      .map((t, i) => {
        if (t.finished) return null;

        // Case 1: Token in home → only move out on 6
        if (t.inHome && dice === 6 && !isStartBlocked(tokens, color)) {
          return { index: i, destPos: 0 };
        }

        // Case 2: Token already on board
        if (!t.inHome && t.pos !== null) {
          const newPos = t.pos + dice;
          if (newPos > path.length - 1) return null; // overshoot
          return { index: i, destPos: newPos };
        }

        return null;
      })
      .filter(Boolean);
  },

  // 🟢 Move a token
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
      if (dice === 6 && !isStartBlocked(tokens, color)) {
        newToken = { pos: 0, inHome: false, finished: false };
      } else {
        return;
      }
    } else {
      const newPos = token.pos + dice;
      if (newPos > path.length - 1) return; // must roll exact to finish

      // 🏠 Home column blocking rule
      if (newPos >= path.length - 6) {
        for (let step = token.pos + 1; step < newPos; step++) {
          if (
            tokens[color].some(
              (other, j) =>
                j !== index && other.pos === step && !other.inHome && !other.finished
            )
          ) {
            return;
          }
        }
      }

      // 🚫 Can't land on own block
      const landingTokens = tokens[color].filter(
        (other, j) =>
          j !== index && other.pos === newPos && !other.inHome && !other.finished
      );
      if (landingTokens.length >= 1) return;

      // Move token
      newToken = { ...token, pos: newPos };
      if (newPos === path.length - 1) newToken.finished = true;
    }

    // Update tokens
    const updatedTokens = {
      ...tokens,
      [color]: tokens[color].map((t, i) => (i === index ? newToken : t)),
    };

    // 🔴 Capture opponents
    if (!newToken.inHome && !newToken.finished) {
      const landingCoord = path[newToken.pos];
      for (const other of players) {
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
            return makeToken(); // send back home
          }
          return t;
        });
      }
    }

    // 🎲 Handle turn switching
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

  // 🔄 Reset game
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

// ------------------ Helpers ------------------

// Block if two of your own tokens already occupy the start square
function isStartBlocked(tokens, color) {
  return (
    tokens[color].filter(
      (t) => !t.inHome && !t.finished && t.pos === 0
    ).length >= 2
  );
}

// Define safe squares
function isSafeSquare(coord, color) {
  // 🟢 You can extend: star tiles, start tiles, etc.
  return isHomeColumn(coord, color) || (coord.r === 7 && coord.c === 7);
}

// Last 6 tiles of a path = home column
function isHomeColumn(coord, color) {
  const path = getColorPath(color);
  const idx = path.findIndex((p) => sameCoord(p, coord));
  return idx >= path.length - 6;
}
