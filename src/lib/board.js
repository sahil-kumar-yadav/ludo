// src/lib/board.js
export const COLORS = {
  RED: "red",
  GREEN: "green",
  YELLOW: "yellow",
  BLUE: "blue",
  NEUTRAL: "neutral",
};

export const TILE = {
  EMPTY: "empty",
  HOME: "home",
  PATH: "path",
  LANE: "lane",
  CENTER: "center",
};

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
  const safeCoords = [ [MID, 2], [MID, 5], [MID, 9], [MID, 12], [2, MID], [5, MID], [9, MID], [12, MID] ];
  for (const [r, c] of safeCoords) if (board[r][c].type === TILE.PATH) board[r][c].isSafe = true;

  return board;
}

function setTile(board, r, c, type, color = null) { board[r][c] = { r, c, type, color, isSafe: false }; }
function setPathIfEmpty(board, r, c) { if (board[r][c].type === TILE.EMPTY) setTile(board, r, c, TILE.PATH, COLORS.NEUTRAL); }
function setLane(board, r, c, color) { setTile(board, r, c, TILE.LANE, color); }

// ---------- Paths (ordered coordinates) ----------
// We model a *straight-arm* path for each color, then into its lane and the center.
// Each path is an array of {r,c}. Index 0 is the entry from home when you roll a 6.

export function getColorPath(color) {
  // Shared constants
  const center = { r: MID, c: MID }; // use as final goal ref (not a tile index)

  if (color === COLORS.RED) {
    // From top outer arm moving *down* toward center, then lane up into center
    const entryToArm = coordsRange(0, MID, 1).slice(0, 6).map(r => ({ r, c: MID })); // r=0..5 at c=7
    const lane = coordsRange(5, 0, -1).map(r => ({ r, c: MID })); // r=5..1 at c=7
    return [...entryToArm, ...lane, center];
  }

  if (color === COLORS.GREEN) {
    // From right outer arm moving *left* toward center, then lane left→center
    const entryToArm = coordsRange(N - 1, MID, -1).slice(0, 6).map(c => ({ r: MID, c })); // c=14..9 at r=7
    const lane = coordsRange(N - 2, N - 6, -1).map(c => ({ r: MID, c })); // c=13..9 at r=7
    return [...entryToArm, ...lane, center];
  }

  if (color === COLORS.BLUE) {
    // From bottom outer arm moving *up* toward center, then lane down→center
    const entryToArm = coordsRange(N - 1, MID, -1).slice(0, 6).map(r => ({ r, c: MID })); // r=14..9
    const lane = coordsRange(N - 2, N - 6, -1).map(r => ({ r, c: MID })); // r=13..9
    return [...entryToArm, ...lane, center];
  }

  if (color === COLORS.YELLOW) {
    // From left outer arm moving *right* toward center, then lane right→center
    const entryToArm = coordsRange(0, MID, 1).slice(0, 6).map(c => ({ r: MID, c })); // c=0..5 at r=7
    const lane = coordsRange(1, 5, 1).map(c => ({ r: MID, c })); // c=1..5
    return [...entryToArm, ...lane, center];
  }

  return [];
}

function coordsRange(start, endExclusive, step) {
  const arr = [];
  if (step > 0) for (let v = start; v < endExclusive; v += step) arr.push(v);
  else for (let v = start; v > endExclusive; v += step) arr.push(v);
  return arr;
}

export function coordKey({ r, c }) { return `${r},${c}`; }
export function sameCoord(a, b) { return a && b && a.r === b.r && a.c === b.c; }