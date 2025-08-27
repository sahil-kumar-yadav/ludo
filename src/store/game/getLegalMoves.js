import { getColorPath, sameCoord } from "../../lib/board";

export function getLegalMoves(get) {
  return () => {
    const { dice, currentPlayer, players, tokens } = get();
    if (!dice) return [];

    const player = players[currentPlayer];
    const color = player.color;
    const path = getColorPath(color);

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

    function isBlocked(coord) {
      const occ = occupancyAt(coord);
      for (const clr of Object.keys(occ.byColor)) {
        if ((occ.byColor[clr] || 0) >= 2) return true;
      }
      return false;
    }

    const startCoord = path[0];

    return tokens[color]
      .map((t, i) => {
        if (t.finished) return null;
        if (t.inHome) {
          if (dice !== 6) return null;
          if (isBlocked(startCoord)) return null;
          return { index: i, destPos: 0 };
        }
        if (!t.inHome && t.pos != null) {
          const newPos = t.pos + dice;
          if (newPos > path.length - 1) return null;
          for (let s = t.pos + 1; s <= newPos; s++) {
            const coord = path[s];
            if (isBlocked(coord)) {
              const occ = occupancyAt(coord);
              const ownerBlockColor = Object.keys(occ.byColor).find(c => occ.byColor[c] >= 2);
              if (s === newPos && ownerBlockColor === color) continue;
              return null;
            }
          }
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
          const landingCoord = path[newPos];
          const landingOcc = occupancyAt(landingCoord);
          const opponentBlockColor = Object.keys(landingOcc.byColor).find(
            (c) => c !== color && landingOcc.byColor[c] >= 2
          );
          if (opponentBlockColor) return null;
          return { index: i, destPos: newPos };
        }
        return null;
      })
      .filter(Boolean);
  };
}