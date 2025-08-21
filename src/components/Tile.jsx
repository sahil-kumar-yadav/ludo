// src/components/Tile.jsx
import { COLORS, TILE } from "@/lib/board";
import clsx from "classnames";

const COLOR_BG = {
  [COLORS.RED]: "bg-gradient-to-br from-red-400 to-red-600",
  [COLORS.GREEN]: "bg-gradient-to-br from-green-400 to-green-600",
  [COLORS.YELLOW]: "bg-gradient-to-br from-yellow-300 to-yellow-500",
  [COLORS.BLUE]: "bg-gradient-to-br from-blue-400 to-blue-600",
  [COLORS.NEUTRAL]: "bg-gray-100",
};

export default function Tile({ cell }) {
  const { type, color, isSafe } = cell;

  const base =
    "relative w-full h-full border border-gray-300 flex items-center justify-center";

  // Backgrounds
  let bg = "bg-transparent";
  if (type === TILE.HOME) bg = COLOR_BG[color];
  else if (type === TILE.PATH) bg = COLOR_BG[COLORS.NEUTRAL];
  else if (type === TILE.LANE) bg = clsx(COLOR_BG[color], "brightness-110");
  else if (type === TILE.CENTER) bg = "bg-gray-200";

  return (
    <div className={clsx(base, bg)}>
      {isSafe && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-yellow-600 text-lg drop-shadow">★</span>
        </div>
      )}
    </div>
  );
}
