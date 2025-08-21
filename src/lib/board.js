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
    HOME: "home", // colored 6x6 corners
    PATH: "path", // neutral 3-wide cross arms
    LANE: "lane", // colored lane from each home to center
    CENTER: "center", // 3x3 goal area
};


// 15x15 layout helpers
const N = 15;
const MID = Math.floor(N / 2); // 7
const ARM = [MID - 1, MID, MID + 1]; // rows/cols 6,7,8 → 3-wide arms


/**
* Build a 15×15 ludo board. This is a *visual* representation with reasonable defaults:
* - Four 6×6 color homes in the corners
* - A 3×3 center goal
* - 3‑wide neutral cross arms
* - Colored 1×5 lanes (home stretch) from each arm into center
* - Mark a few common safe tiles along the neutral arms (adjust later as needed)
*/
export function createBoard() {
    const board = Array.from({ length: N }, (_, r) =>
        Array.from({ length: N }, (_, c) => ({ r, c, type: TILE.EMPTY, color: null, isSafe: false }))
    );


    // 1) Color home quadrants (6×6 blocks)
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (r < 6 && c < 6) setTile(board, r, c, TILE.HOME, COLORS.RED);
            else if (r < 6 && c > 8) setTile(board, r, c, TILE.HOME, COLORS.GREEN);
            else if (r > 8 && c < 6) setTile(board, r, c, TILE.HOME, COLORS.YELLOW);
            else if (r > 8 && c > 8) setTile(board, r, c, TILE.HOME, COLORS.BLUE);
        }
    }


}