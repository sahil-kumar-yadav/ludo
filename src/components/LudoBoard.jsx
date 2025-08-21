"use client";
import { useGameStore } from "../store/gameStore";
import { createBoard, coordKey, getColorPath, sameCoord, getHomePositions } from "../lib/board";
import Token from "./Token";
import Dice from "./Dice";
import "../styles/ludo.css";

const board = createBoard();

export default function LudoBoard() {
  const { tokens, players, moveToken, currentPlayer, getLegalMoves } =
    useGameStore();
  const legalMoves = getLegalMoves();
  const legalMoveIndices = legalMoves.map(m => m.index);

  const renderCell = (cell) => {
    const tokenElems = [];



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
                canMove={player.id === currentPlayer && legalMoveIndices.includes(i)}
                onClick={() => moveToken(player.color, i)}
              >
                {i + 1}
              </Token>
            );
          }
        }
      });
    }

    // Home tokens
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
                canMove={player.id === currentPlayer && legalMoves.includes(i)}
                onClick={() => moveToken(player.color, i)}
              >
                {i + 1}
              </Token>
            );
          }

        }
      });
    }

    // Center: show finished tokens
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
                {i + 1}
              </Token>
            );
          }
        });
      }
    }

    return (
      <div
        key={coordKey(cell)}
        className={`cell type-${cell.type} ${cell.color ? `color-${cell.color}` : ""} ${cell.isSafe ? "safe" : ""}`}
      >
        {tokenElems}
      </div>
    );
  };

  return (
    <div className="ludo-container">
      <div className="board">
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((cell) => renderCell(cell))}
          </div>
        ))}
      </div>
      <div className="controls">
        <Dice />
        <div className="turn-indicator">
          Turn: <span>{players[currentPlayer].color}</span>
        </div>
      </div>
    </div>
  );
}
