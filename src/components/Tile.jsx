// src/components/Tile.jsx
import { COLORS, TILE } from "@/lib/board";
import clsx from "classnames";


const COLOR_BG = {
    [COLORS.RED]: "bg-red-400",
    [COLORS.GREEN]: "bg-green-400",
    [COLORS.YELLOW]: "bg-yellow-300",
    [COLORS.BLUE]: "bg-blue-400",
    [COLORS.NEUTRAL]: "bg-gray-200",
};


export default function Tile({ cell }) {
    const { type, color, isSafe } = cell;


    const base = "relative w-full h-full border border-white/60";


    // Determine background by type
    let bg = "bg-transparent";
    if (type === TILE.HOME) bg = COLOR_BG[color];
    else if (type === TILE.PATH) bg = COLOR_BG[COLORS.NEUTRAL];
    else if (type === TILE.LANE) bg = clsx(COLOR_BG[color], "brightness-110");
    else if (type === TILE.CENTER) bg = "bg-gray-300";


    return (
        <div className={clsx(base, bg)}>
            {isSafe && (
                <div className="absolute inset-0 grid place-items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white border border-black/30 shadow" />
                </div>
            )}
        </div>
    );
}