// src/lib/board.js

import { COLORS, TILE, HOME_PATHS, CENTER, SAFE_SQUARES, coordKey, sameCoord } from "./board-constants";



const N = 15;
const MID = Math.floor(N / 2); // 7
const ARM = [MID - 1, MID, MID + 1]; // 6,7,8

export function createBoard() {
  const board = Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => ({ r, c, type: TILE.EMPTY, color: null, isSafe: false }))
  );

  // Homes (6x6)
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (r < 6 && c < 6) setTile(board, r, c, TILE.HOME, COLORS.RED);
      else if (r < 6 && c > 8) setTile(board, r, c, TILE.HOME, COLORS.GREEN);
      else if (r > 8 && c < 6) setTile(board, r, c, TILE.HOME, COLORS.YELLOW);
      else if (r > 8 && c > 8) setTile(board, r, c, TILE.HOME, COLORS.BLUE);
    }
  }

  // Center 3×3 goal
  for (let r = MID - 1; r <= MID + 1; r++) {
    for (let c = MID - 1; c <= MID + 1; c++) {
      setTile(board, r, c, TILE.CENTER, COLORS.NEUTRAL);
    }
  }

  // Neutral cross arms (rows 6,7,8 and cols 6,7,8 across full span)
  for (let r of ARM) for (let c = 0; c < N; c++) setPathIfEmpty(board, r, c);
  for (let c of ARM) for (let r = 0; r < N; r++) setPathIfEmpty(board, r, c);

  // Colored lanes to center (1×5 each)
  for (let r = 1; r <= 5; r++) setLane(board, r, MID, COLORS.RED);     // top → center
  for (let c = N - 2; c >= N - 6; c--) setLane(board, MID, c, COLORS.GREEN); // right → center
  for (let r = N - 2; r >= N - 6; r--) setLane(board, r, MID, COLORS.BLUE);  // bottom → center
  for (let c = 1; c <= 5; c++) setLane(board, MID, c, COLORS.YELLOW);        // left → center

  // Safe dots (visual)
  const safeCoords = [[MID, 2], [MID, 5], [MID, 9], [MID, 12], [2, MID], [5, MID], [9, MID], [12, MID]];
  for (const [r, c] of safeCoords) if (board[r][c].type === TILE.PATH) board[r][c].isSafe = true;

  return board;
}

function setTile(board, r, c, type, color = null) { board[r][c] = { r, c, type, color, isSafe: false }; }
function setPathIfEmpty(board, r, c) { if (board[r][c].type === TILE.EMPTY) setTile(board, r, c, TILE.PATH, COLORS.NEUTRAL); }
function setLane(board, r, c, color) { setTile(board, r, c, TILE.LANE, color); }

// ---------- Paths (ordered coordinates) ----------
export function getColorPath(color) {
  // The outer path (52 squares, clockwise)
  const path = [];

  // Start from RED's entry: (6, 0)
  // 1. RED's row: Move right from (6,0) to (6,5)
  for (let c = 0; c <= 5; c++) path.push({ r: 6, c });

  // 2. Move up to GREEN's column: from (5,5) to (0,6)
  for (let r = 5; r >= 0; r--) path.push({ r, c: 6 });

  // 3. Move right across GREEN's row: from (0,6) to (0,8)
  for (let c = 7; c <= 7; c++) path.push({ r: 0, c });

  // 4. Move down GREEN's column: from (0,8) to (5,8)
  for (let r = 0; r <= 5; r++) path.push({ r, c: 8 });

  // 5. Move right to YELLOW's row: from (5,8) to (6,14)
  for (let c = 9; c <= 14; c++) path.push({ r: 6, c });

  // 6. Move down to YELLOW's column: from (6,14) to (8,14)
  for (let r = 7; r <= 7; r++) path.push({ r, c: 14 });

  // 7. Move left across YELLOW's row: from (8,14) to (8,9)
  for (let c = 14; c >= 9; c--) path.push({ r: 8, c });

  // 8. Move down to BLUE's column: from (8,9) to (14,8)
  for (let r = 9; r <= 14; r++) path.push({ r, c: 8 });

  // 9. Move left across BLUE's row: from (14,8) to (14,6)
  for (let c = 7; c >= 7; c--) path.push({ r: 14, c });

  // 10. Move up BLUE's column: from (14,6) to (9,6)
  for (let r = 14; r >= 9; r--) path.push({ r, c: 6 });

  // 11. Move left to RED's row: from (9,6) to (8,0)
  for (let c = 5; c >= 0; c--) path.push({ r: 8, c });

  // 12. Move up to complete loop: from (8,0) to (7,0)
  for (let r = 8; r >= 8; r--) path.push({ r, c: 0 });

  // Now, for each color, rotate the path so that index 0 is that color's entry square
  // RED: (6,0), GREEN: (0,8), YELLOW: (14,6), BLUE: (8,14)
  let entryIndex = 0;
  if (color === COLORS.RED) entryIndex = path.findIndex(p => p.r === 6 && p.c === 0);
  if (color === COLORS.GREEN) entryIndex = path.findIndex(p => p.r === 0 && p.c === 8);
  if (color === COLORS.YELLOW) entryIndex = path.findIndex(p => p.r === 14 && p.c === 6);
  if (color === COLORS.BLUE) entryIndex = path.findIndex(p => p.r === 8 && p.c === 14);

  // Rotate path for this color
  const colorPath = [...path.slice(entryIndex), ...path.slice(0, entryIndex)];

  // Add the home column (6 squares) for each color
  if (color === COLORS.RED) {
    // RED: From (6,7) → (1,7) — Up to center
    for (let r = 6; r >= 1; r--) colorPath.push({ r, c: 7 });
  }
  if (color === COLORS.GREEN) {
    // GREEN: From (7,8) → (7,13) — Right to center
    for (let c = 8; c <= 13; c++) colorPath.push({ r: 7, c });
  }
  if (color === COLORS.YELLOW) {
    // YELLOW: From (8,7) → (13,7) — Down to center
    for (let r = 8; r <= 13; r++) colorPath.push({ r, c: 7 });
  }
  if (color === COLORS.BLUE) {
    // BLUE: From (7,6) → (7,1) — Left to center
    for (let c = 6; c >= 1; c--) colorPath.push({ r: 7, c });
  }

  // Center
  colorPath.push({ r: 7, c: 7 });

  return colorPath;
}

export function getHomePositions(color) {
  // Returns array of 4 {r, c} for each color's home
  if (color === COLORS.RED) return [{ r: 1, c: 1 }, { r: 1, c: 4 }, { r: 4, c: 1 }, { r: 4, c: 4 }];
  if (color === COLORS.GREEN) return [{ r: 1, c: 10 }, { r: 1, c: 13 }, { r: 4, c: 10 }, { r: 4, c: 13 }];
  if (color === COLORS.YELLOW) return [{ r: 10, c: 1 }, { r: 10, c: 4 }, { r: 13, c: 1 }, { r: 13, c: 4 }];
  if (color === COLORS.BLUE) return [{ r: 10, c: 10 }, { r: 10, c: 13 }, { r: 13, c: 10 }, { r: 13, c: 13 }];
  return [];
}