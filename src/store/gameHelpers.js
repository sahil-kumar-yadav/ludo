import { getColorPath, sameCoord } from "../lib/board";

// Block if two of your own tokens already occupy the start square
export function isStartBlocked(tokens, color) {
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
        if (coord.r === startCoord.r && coord.c === startCoord.c) {
          counts[clr]++;
        }
      }
    });
  }
  // Blocked if ANY color has 2+ tokens there
  return Object.values(counts).some((n) => n >= 2);
}

export function isSafeSquare(coord, color) {
  // You can extend: star tiles, start tiles, etc.
  return isHomeColumn(coord, color) || (coord.r === 7 && coord.c === 7);
}

export function isHomeColumn(coord, color) {
  const path = getColorPath(color);
  const idx = path.findIndex((p) => sameCoord(p, coord));
  return idx >= path.length - 6;
}