# Task: make movement of all tokens proper and change position of initial blue and yellow token proper
# 🎲 Ludo Game  
**Next.js + Zustand + TailwindCSS**

A beautifully crafted, modern Ludo board game you can play right in your browser — built using **Next.js**, **Zustand**, and **TailwindCSS**.  
Enjoy rich animations, smooth game logic, and a responsive UI. Classic Ludo, modern vibes.

---

## ✨ Features

- 🗺️ **15×15 Ludo Board** with colored home zones & safe tiles  
- 🧠 **Smart Game Logic** powered by Zustand  
- 🎲 **Animated Dice Rolls** with valid-move highlights  
- 🟢 **Real Token Rules**
  - Enter board on a **6**
  - Navigate the **classic 52-tile loop**
  - **Capture** opponent tokens (except on safe tiles)
  - Reach the **home lane** to win
- ⚡ **Framer Motion animations** throughout  
- 📱 **Fully Responsive** (desktop & mobile)

---

## 🛠️ Tech Stack

| Tech             | Role                     |
|------------------|--------------------------|
| **Next.js**      | App Routing & SSR        |
| **Zustand**      | State Management         |
| **TailwindCSS**  | Utility-first Styling    |
| **Framer Motion**| Smooth Animations        |
| *(Optional)*     | Supabase / WebSockets for multiplayer |

---

## 📁 Project Structure

```

src/
├─ app/
│  └─ page.js          # Main entry point
├─ components/
│  ├─ LudoBoard.js     # Board rendering
│  ├─ Token.js         # Token rendering & animations
│  └─ Dice.js          # Dice logic
├─ store/
│  └─ gameStore.js     # Zustand game state
├─ lib/
│  └─ board.js         # Tile path & logic
└─ styles/
└─ globals.css      # Tailwind + custom styles

````

---

## 🚀 Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/ludo-game.git
cd ludo-game
npm install
````

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser 🚀

---

## 🧩 Gameplay Rules

1. Each player has **4 tokens**.
2. Roll a **6** to enter the board.
3. Move tokens around the **52-tile ring**.
4. Land on an opponent to **capture** them — unless they're on a safe tile.
5. Guide tokens into your **home lane**.
6. First to bring all tokens home **wins** 🏆

---

## 🗺️ Roadmap

* ✅ Local multiplayer (2–4 players)
* 🔜 Online multiplayer via WebSockets / Supabase
* 🔜 In-game chat & emoji reactions
* 🔜 PWA support for mobile play

---

## 🖼️ Demo Preview

> 📌 *Coming soon!*
> Add a screenshot of the board once the UI is polished.
> *(Want a placeholder image in the meantime? Let me know!)*

---

## 🤝 Contributing

Pull requests are welcome!
Fork the repo, create a new branch, and submit your changes via PR.
Let’s build it better together 💪

---

## 📄 License

MIT License © 2025 \[Your Name]

---

> 🧠 *Built for fun & learning* — relive your childhood, one dice roll at a time.

game logic

1. Board Construction and Representation
File: src/lib/board.js
Constants: src/lib/board-constants.js

Board Shape:
The board is a 15x15 grid (N = 15).

The four corners (6x6 each) are the colored home areas for each player.
The center (3x3) is the goal area.
The arms (rows/columns 6, 7, 8) form the cross-shaped path.
Colored "lanes" lead from each player's entry point to the center.
Board Creation:
The function createBoard() builds this grid, assigning each cell a type (HOME, PATH, LANE, CENTER, etc.) and color.

Helper functions like setTile, setPathIfEmpty, and setLane are used to assign properties to each cell.
Safe squares are marked for special rules.
Board Constants:

COLORS, TILE, and other helpers are defined in board-constants.js.
coordKey and sameCoord are utility functions for comparing or identifying board cells.
2. Token Paths and Movement
File: src/lib/board.js

Path Calculation:

getColorPath(color) returns an array of coordinates representing the path a token of a given color will follow from its start, around the board, up its colored lane, and into the center.
The path is rotated so that each color starts at its own entry point.
Home Positions:

getHomePositions(color) returns the four starting positions for each player's tokens.
3. Game State Management
File: src/store/gameStore.js

State Management:

Uses Zustand for global state.
State includes: players, tokens, currentPlayer, dice, and more.
Actions include: rollDice, getLegalMoves, moveToken, and reset.
Token State:

Each token has properties like inHome, pos (index in path), and finished.
The tokens object tracks all tokens for all players.
Game Logic:

getLegalMoves determines which tokens can move based on the dice roll and game rules.
moveToken updates the state when a token is moved.
rollDice and reset handle dice rolling and game resets.
4. Rendering the Board and Tokens
File: src/components/LudoBoard.jsx

Board Rendering:

The board is created once with createBoard().
Each cell is rendered using the renderCell function, which:
Checks if a token should be displayed in that cell (either on the path, in home, or in the center).
Renders the appropriate Token component(s) for each cell.
Applies CSS classes for color, type, and safe squares.
Token Rendering:

Tokens are rendered based on their state:
On the path/lane: if !inHome && pos !== null
In home: if inHome
In center: if finished
The Token component receives props for color, index, and click handlers.
Interactivity:

Clicking a token (if it's the current player's turn and the move is legal) calls moveToken.
The dice and current turn are displayed alongside the board.
5. How the Pieces Fit Together
Board Layout:

The board is a static 2D array of cells, each with a type and color.
The path for each color is a precomputed list of coordinates.
Tokens:

Each token knows its position in its path (or if it's in home/finished).
Moving a token means updating its pos (or inHome/finished status).
Game Flow:

The current player rolls the dice.
Legal moves are computed.
The player clicks a token to move it.
The state updates, and the UI re-renders accordingly.
6. References and Flow
Board and Path Logic:

src/lib/board.js
src/lib/board-constants.js
Game State and Logic:

src/store/gameStore.js
(and submodules in game)
UI and Rendering:

src/components/LudoBoard.jsx
src/components/Token.jsx
src/components/Dice.jsx
7. Summary
The board is a 15x15 grid, divided into home areas, paths, lanes, and center.
Each token follows a color-specific path, managed by the game state.
The UI renders the board and tokens based on the current state.
All game logic (moves, dice, turns) is handled in the store and helper functions.
