// src/store/gameStore.js
import { create } from "zustand";
import { COLORS, getColorPath, sameCoord } from "../lib/board";

const initialPlayers = [
  { id: 0, color: COLORS.RED },
  { id: 1, color: COLORS.GREEN },
  { id: 2, color: COLORS.YELLOW },
  { id: 3, color: COLORS.BLUE },
];

export const useGameStore = create((set, get) => ({
  players: initialPlayers,
  tokens: {
    [COLORS.RED]: Array(4).fill({ pos: null, inHome: true }),
    [COLORS.GREEN]: Array(4).fill({ pos: null, inHome: true }),
    [COLORS.YELLOW]: Array(4).fill({ pos: null, inHome: true }),
    [COLORS.BLUE]: Array(4).fill({ pos: null, inHome: true }),
  },
  currentPlayer: 0,
  dice: null,
  rolling: false,

  rollDice: () => {
    set({ rolling: true });
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      set({ dice, rolling: false });
    }, 800); // little animation delay
  },

  getLegalMoves: () => {
    const { dice, currentPlayer, players, tokens } = get();
    if (!dice) return [];
    const player = players[currentPlayer];
    const path = getColorPath(player.color);

    return tokens[player.color]
      .map((t, i) => {
        if (t.inHome && dice === 6) return i; // can enter board
        if (!t.inHome && t.pos + dice < path.length) return i;
        return null;
      })
      .filter((i) => i !== null);
  },

  moveToken: (color, index) => {
    const { dice, tokens, currentPlayer, players } = get();
    if (!dice) return;

    const player = players[currentPlayer];
    if (player.color !== color) return;

    const path = getColorPath(color);
    const token = tokens[color][index];

    let newToken = { ...token };

    if (token.inHome) {
      if (dice === 6) {
        newToken = { pos: 0, inHome: false };
      } else {
        return;
      }
    } else {
      let newPos = token.pos + dice;
      if (newPos >= path.length) return;
      newToken = { ...token, pos: newPos };
    }

    // Capture logic
    const landingCoord = path[newToken.pos] || null;
    let updatedTokens = { ...tokens };
    updatedTokens[color] = tokens[color].map((t, i) =>
      i === index ? newToken : t
    );

    if (landingCoord) {
      for (let other of players) {
        if (other.color === color) continue;
        const oppTokens = updatedTokens[other.color].map((t) => {
          if (t.inHome || t.pos == null) return t;
          const oppPath = getColorPath(other.color);
          const oppCoord = oppPath[t.pos];
          if (sameCoord(oppCoord, landingCoord) && !landingCoord.isSafe) {
            return { pos: null, inHome: true }; // send back home
          }
          return t;
        });
        updatedTokens[other.color] = oppTokens;
      }
    }

    set({
      tokens: updatedTokens,
      dice: null,
      currentPlayer: (currentPlayer + 1) % players.length,
    });
  },
}));
