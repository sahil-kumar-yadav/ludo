// src/lib/board-constants.js

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

export const HOME_PATHS = {
  RED:    [52, 53, 54, 55, 56, 57], 
  GREEN:  [58, 59, 60, 61, 62, 63], 
  YELLOW: [64, 65, 66, 67, 68, 69], 
  BLUE:   [70, 71, 72, 73, 74, 75], 
};

export const CENTER = 100;

export const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47]; 

export function coordKey({ r, c }) { return `${r},${c}`; }
export function sameCoord(a, b) { return a && b && a.r === b.r && a.c === b.c; }