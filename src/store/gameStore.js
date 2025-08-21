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

    // helper: occupancy map at a coordinate (counts per color)
    function occupancyAt(coord) {
      const byColor = {};
      let total = 0;
      for (const p of players) byColor[p.color] = 0;

      for (const p of players) {
        const pPath = getColorPath(p.color);
        tokens[p.color].forEach((t) => {
          if (t.inHome || t.pos == null) return;
          const c = pPath[t.pos];
          if (sameCoord(c, coord)) {
            byColor[p.color] = (byColor[p.color] || 0) + 1;
            total++;
          }
        });
      }

      return { total, byColor };
    }

    // helper: true if there's a block (>=2 tokens of same color) at coord
    function isBlocked(coord) {
      const occ = occupancyAt(coord);
      for (const clr of Object.keys(occ.byColor)) {
        if ((occ.byColor[clr] || 0) >= 2) return true;
      }
      return false;
    }

    // start coord for this color
    const startCoord = path[0];

    return tokens[color]
      .map((t, i) => {
        if (t.finished) return null;

        // CASE: token in home -> only move out on a 6 and if start is not blocked
        if (t.inHome) {
          if (dice !== 6) return null;
          if (isBlocked(startCoord)) return null; // can't enter if start has a block
          return { index: i, destPos: 0 };
        }

        // CASE: token already on board
        if (!t.inHome && t.pos != null) {
          const newPos = t.pos + dice;
          if (newPos > path.length - 1) return null; // overshoot (must exact)

          // 1) Check for blocks in the path (cannot pass over any block)
          // allow landing on your own block if final square is a block owned by you,
          // but you cannot pass over any block.
          for (let s = t.pos + 1; s <= newPos; s++) {
            const coord = path[s];
            if (isBlocked(coord)) {
              const occ = occupancyAt(coord);
              // if blocked and the block is owned by current player AND s == newPos => allow landing on own block
              const ownerBlockColor = Object.keys(occ.byColor).find(c => occ.byColor[c] >= 2);
              if (s === newPos && ownerBlockColor === color) {
                // landing on your own block is allowed
                continue;
              }
              // otherwise blocked -> invalid move
              return null;
            }
          }

          // 2) Home-column jump rule: cannot jump over your own tokens in home stretch
          if (newPos >= path.length - 6) {
            for (let step = t.pos + 1; step < newPos; step++) {
              if (
                tokens[color].some(
                  (other, j) =>
                    j !== i && other.pos === step && !other.inHome && !other.finished
                )
              ) {
                return null;
              }
            }
          }

          // 3) Evaluate landing square: can't land on opponent block
          const landingCoord = path[newPos];
          const landingOcc = occupancyAt(landingCoord);
          const opponentBlockColor = Object.keys(landingOcc.byColor).find(
            (c) => c !== color && landingOcc.byColor[c] >= 2
          );
          if (opponentBlockColor) return null; // blocked by opponent block

          // allowed: landing on empty, landing on opponent single token (capture), landing on your own tokens (stack)
          return { index: i, destPos: newPos };
        }

        return null;
      })
      .filter(Boolean);
  },


  // 🟢 Move a token
  // 🟢 Move a token with step-by-step animation and robust game rules
  moveToken: (color, index) => {
    const { dice, tokens, currentPlayer, players, sixStreak, animating } = get();
    if (!dice) return;
    if (animating) return; // prevent concurrent moves

    const player = players[currentPlayer];
    if (player.color !== color) return;

    const path = getColorPath(color);
    const token = tokens[color][index];
    if (!token) return;

    // Determine start and final positions
    const fromHome = !!token.inHome;
    let startPos = token.inHome ? null : token.pos;
    if (!fromHome && (startPos === null || startPos === undefined)) return;

    // If token in home -> only allowed on a 6 and start not blocked
    if (fromHome) {
      if (dice !== 6 || isStartBlocked(tokens, color)) return;
    }

    const finalPos = fromHome ? 0 : startPos + dice;
    // must roll exact to finish
    if (finalPos > path.length - 1) return;

    // Pre-check: if landing in home column, ensure not jumping over own tokens in that column
    const stepFrom = fromHome ? 0 : startPos + 1;
    const stepTo = finalPos;
    if (stepTo >= path.length - 6) {
      for (let s = stepFrom; s < stepTo; s++) {
        if (
          tokens[color].some(
            (other, j) => j !== index && other.pos === s && !other.inHome && !other.finished
          )
        ) {
          return; // blocked by own token in home column
        }
      }
    }

    // ✅ Pre-check: can't land on opponent block (≥2)
    for (const clr of Object.keys(tokens)) {
      const occ = tokens[clr].filter(
        (t, j) => !t.inHome && !t.finished && t.pos === finalPos
      ).length;
      if (clr !== color && occ >= 2) {
        return; // blocked by opponent block
      }
    }
    // 👉 Own tokens are allowed here (stacking/block creation is legal)

    // Mark animating
    set({ animating: true });

    // Animation helper (step-by-step)
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
    function animateStep(step) {
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
    }

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
                return makeToken(); // send opponent home
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
  const path = getColorPath(color);
  const startCoord = path[0];

  // Count tokens at start square grouped by color
  const counts = {};
  for (const clr of Object.keys(tokens)) {
    counts[clr] = 0;
    tokens[clr].forEach((t) => {
      if (!t.inHome && !t.finished && t.pos !== null) {
        const cPath = getColorPath(clr);
        const coord = cPath[t.pos];
        if (coord.row === startCoord.row && coord.col === startCoord.col) {
          counts[clr]++;
        }
      }
    });
  }

  // Blocked if ANY color has 2+ tokens there
  return Object.values(counts).some((n) => n >= 2);
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
