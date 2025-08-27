// src/components/Tile.jsx
import { COLORS, TILE } from "@/lib/board";
import clsx from "classnames";

const COLOR_BG = {
  [COLORS.RED]: "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
  [COLORS.GREEN]: "bg-gradient-to-br from-green-500 via-green-600 to-green-700",
  [COLORS.YELLOW]: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600",
  [COLORS.BLUE]: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
  [COLORS.NEUTRAL]: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400",
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
