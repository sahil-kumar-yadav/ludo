"use client";
import { useGameStore } from "../store/gameStore";
import {
  createBoard,
  coordKey,
  getColorPath,
  sameCoord,
  getHomePositions,
} from "../lib/board";
import Token from "./Token";
import Dice from "./Dice";
import clsx from "classnames";

const board = createBoard();

export default function LudoBoard() {
  const { tokens, players, moveToken, currentPlayer, getLegalMoves } =
    useGameStore();
  const legalMoves = getLegalMoves();
  const legalMoveIndices = legalMoves.map((m) => m.index);

  const renderCell = (cell) => {
    const tokenElems = [];

    // 🟢 Render normal + lane path tokens
    for (let player of players) {
      tokens[player.color].forEach((t, i) => {
        if (!t.inHome && t.pos !== null) {
          const path = getColorPath(player.color);
          const coord = path[t.pos];
          if (sameCoord(coord, cell)) {
            tokenElems.push(
              <Token
                key={`${player.color}-${i}`}
                color={player.color}
                index={i}
                canMove={
                  player.id === currentPlayer &&
                  legalMoveIndices.includes(i)
                }
                onClick={() => moveToken(player.color, i)}
              >
                {i + 1}
              </Token>
            );
          }
        }
      });
    }

    // 🏠 Render tokens in home squares
    for (let player of players) {
      const homePositions = getHomePositions(player.color);
      homePositions.forEach((homeCoord, i) => {
        if (sameCoord(homeCoord, cell)) {
          const t = tokens[player.color][i];
          if (t.inHome) {
            tokenElems.push(
              <Token
                key={`${player.color}-home-${i}`}
                color={player.color}
                index={i}
                canMove={
                  player.id === currentPlayer &&
                  legalMoveIndices.includes(i)
                }
                onClick={() => moveToken(player.color, i)}
              >
                {i + 1}
              </Token>
            );
          }
        }
      });
    }

    // 👑 Render finished tokens in the center
    if (cell.type === "center") {
      for (let player of players) {
        tokens[player.color].forEach((t, i) => {
          if (t.finished) {
            tokenElems.push(
              <Token
                key={`${player.color}-finished-${i}`}
                color={player.color}
                index={i}
                canMove={false}
              >
                👑
              </Token>
            );
          }
        });
      }
    }

    return (
      <div
        key={coordKey(cell)}
        className={clsx(
          "relative w-8 h-8 sm:w-10 sm:h-10 border flex items-center justify-center transition-colors duration-200",
          cell.type === "path" && "bg-white",
          cell.type === "home" && {
            red: "bg-red-200",
            green: "bg-green-200",
            yellow: "bg-yellow-100",
            blue: "bg-blue-200",
          }[cell.color],
          cell.type === "lane" && {
            red: "bg-red-400/80",
            green: "bg-green-400/80",
            yellow: "bg-yellow-300/80",
            blue: "bg-blue-400/80",
          }[cell.color],
          cell.type === "center" && "bg-gray-200",
          cell.isSafe &&
            "bg-yellow-100 after:content-['★'] after:text-yellow-500 after:text-xs after:absolute"
        )}
      >
        {tokenElems}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Board */}
      <div className="grid grid-cols-15 bg-white shadow-2xl border-4 border-gray-400 rounded-xl overflow-hidden">
        {board.map((row) => row.map((cell) => renderCell(cell)))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        <Dice />
        <div className="text-lg font-semibold">
          Turn:{" "}
          <span className="capitalize text-indigo-600">
            {players[currentPlayer].color}
          </span>
        </div>
      </div>
    </div>
  );
}
