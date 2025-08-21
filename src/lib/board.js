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
  // The outer path (52 squares, clockwise)
  // Each entry is {r, c}
  const path = [];

  // Define the outer path (starting from RED's entry, then clockwise)
  // RED entry: (0,7)
  for (let c = 0; c <= 5; c++) path.push({ r: 6, c });         // left to right, top arm
  for (let r = 6; r >= 0; r--) path.push({ r, c: 6 });         // up, left arm
  for (let c = 6; c <= 8; c++) path.push({ r: 0, c });         // right, top edge
  for (let r = 1; r <= 5; r++) path.push({ r, c: 8 });         // down, right arm
  for (let c = 8; c <= 14; c++) path.push({ r: 6, c });        // right, top arm
  for (let r = 7; r <= 8; r++) path.push({ r, c: 14 });        // down, right edge
  for (let c = 13; c >= 9; c--) path.push({ r: 8, c });        // left, bottom arm
  for (let r = 9; r <= 14; r++) path.push({ r, c: 8 });        // down, right arm
  for (let c = 8; c >= 6; c--) path.push({ r: 14, c });        // left, bottom edge
  for (let r = 13; r >= 9; r--) path.push({ r, c: 6 });        // up, left arm
  for (let c = 5; c >= 0; c--) path.push({ r: 8, c });         // left, bottom arm
  for (let r = 7; r >= 7; r--) path.push({ r, c: 0 });         // up, left edge

  // Now, for each color, rotate the path so that index 0 is that color's entry square
  // RED: (6,0), GREEN: (0,8), YELLOW: (8,14), BLUE: (14,6)
  let entryIndex = 0;
  if (color === COLORS.RED) entryIndex = path.findIndex(p => p.r === 6 && p.c === 0);
  if (color === COLORS.GREEN) entryIndex = path.findIndex(p => p.r === 0 && p.c === 8);
  if (color === COLORS.YELLOW) entryIndex = path.findIndex(p => p.r === 8 && p.c === 14);
  if (color === COLORS.BLUE) entryIndex = path.findIndex(p => p.r === 14 && p.c === 6);

  // Rotate path for this color
  const colorPath = [...path.slice(entryIndex), ...path.slice(0, entryIndex)];

  // Add the home column (6 squares) for each color
  if (color === COLORS.RED) {
    for (let r = 5; r >= 0; r--) colorPath.push({ r, c: 7 }); // up to center
  }
  if (color === COLORS.GREEN) {
    for (let c = 9; c <= 14; c++) colorPath.push({ r: 7, c }); // right to center
  }
  if (color === COLORS.YELLOW) {
    for (let r = 9; r <= 14; r++) colorPath.push({ r, c: 7 }); // down to center
  }
  if (color === COLORS.BLUE) {
    for (let c = 5; c >= 0; c--) colorPath.push({ r: 7, c }); // left to center
  }

  // Center
  colorPath.push({ r: 7, c: 7 });

  return colorPath;
}

function coordsRange(start, endExclusive, step) {
  const arr = [];
  if (step > 0) for (let v = start; v < endExclusive; v += step) arr.push(v);
  else for (let v = start; v > endExclusive; v += step) arr.push(v);
  return arr;
}

export function getHomePositions(color) {
  // Returns array of 4 {r, c} for each color's home
  if (color === COLORS.RED)    return [ {r:1,c:1}, {r:1,c:4}, {r:4,c:1}, {r:4,c:4} ];
  if (color === COLORS.GREEN)  return [ {r:1,c:10}, {r:1,c:13}, {r:4,c:10}, {r:4,c:13} ];
  if (color === COLORS.YELLOW) return [ {r:10,c:1}, {r:10,c:4}, {r:13,c:1}, {r:13,c:4} ];
  if (color === COLORS.BLUE)   return [ {r:10,c:10}, {r:10,c:13}, {r:13,c:10}, {r:13,c:13} ];
  return [];
}


// assuming your path length = 52 tiles
export const HOME_PATHS = {
  RED:    [52, 53, 54, 55, 56, 57], 
  GREEN:  [58, 59, 60, 61, 62, 63], 
  YELLOW: [64, 65, 66, 67, 68, 69], 
  BLUE:   [70, 71, 72, 73, 74, 75], 
};

// final center position
export const CENTER = 100;


export const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47]; 


export function coordKey({ r, c }) { return `${r},${c}`; }
export function sameCoord(a, b) { return a && b && a.r === b.r && a.c === b.c; }