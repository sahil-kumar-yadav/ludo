# 🔥 Ludo Game with Next.js

Build a modern, animated Ludo game from scratch using **Next.js (App Router)**, **Zustand** for state management, and **TailwindCSS + custom CSS** for styling. Designed with modular components and scalability in mind, this project evolves step by step from a local multiplayer game to an online-ready experience.

---

## ⚙️ Tech Stack

- **Next.js (App Router)** – File-based routing & server rendering
- **Zustand** – Lightweight state management for game logic
- **TailwindCSS + custom CSS** – Utility-first styling with scoped enhancements
- **Framer Motion** – Smooth token/dice animations
- **Supabase Realtime / WebSockets** – Multiplayer support (planned)

---

## ✅ Features

- 🎲 Fully playable **Ludo game board**
- 🧠 Accurate **token movement rules**
- 🧩 Modular components (`Board`, `Dice`, `Token`, `PlayerPanel`, etc.)
- 🧪 Built with **game state modeling** in Zustand
- 📱 Mobile-responsive UI
- 💅 Animated dice rolls and token transitions
- 🌐 Multiplayer-ready architecture

---

## 🗺️ Project Structure

```bash
/src
  ├── components      # Board, Dice, Token, etc.
  ├── hooks           # Zustand game state hooks
  ├── lib             # Utilities (e.g. game logic)
  ├── styles          # Global & component styles
  ├── app             # Next.js App Router structure
  └── types           # TypeScript types/interfaces
````

---

## 🛠️ Step-by-Step Development Plan

We’re building the game iteratively. After each step, we pause and confirm before continuing.

1. **Project Setup**
   ⬜ Create Next.js project with Tailwind & Zustand
   ⬜ Setup `/src` folder structure

2. **Draw the Board (15×15 grid)**
   ⬜ Render Ludo layout with colored homes and safe squares

3. **Game State with Zustand**
   ⬜ Model players, dice, tokens, and turn logic
   ⬜ Show tokens on the board

4. **Token Movement Rules**
   ⬜ Enter on 6, advance forward
   ⬜ Capture opponents, block allies, finish path

5. **UX Polish**
   ⬜ Add dice roll animations
   ⬜ Highlight legal moves
   ⬜ Animate token movements (Framer Motion)

6. **Classic 52-Tile Ludo Path**
   ⬜ Replace grid with real Ludo path logic
   ⬜ Add per-color finish lanes and safe spots

7. **UI Improvements**
   ⬜ Gradient game board
   ⬜ Responsive mobile layout
   ⬜ Smoother transitions

8. **Multiplayer Extension** *(optional)*
   ⬜ Real-time gameplay with Supabase or WebSockets
   ⬜ Online lobby & player sync

---

## 🧪 Development

### 📦 Install dependencies

```bash
npm install
# or
yarn install
```

### 🚀 Run locally

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) to play.

---

## 🧱 Component Architecture

| Component      | Purpose                          |
| -------------- | -------------------------------- |
| `Board`        | Draws the Ludo grid and homes    |
| `Dice`         | Rolls and displays dice value    |
| `Token`        | Represents movable player tokens |
| `PlayerPanel`  | Shows current player and stats   |
| `GameProvider` | Zustand game state context       |

---

## 📸 Screenshots *(coming soon)*

> Animated previews and mobile UI screenshots will be added as development progresses.

---

## 🧠 Next Step

We're following a **step-by-step prompt-driven approach**. After each step, I will stop and ask:

> *"✅ Ready to continue to the next step?"*

---

## 📜 License

MIT © 2025 \[Your Name or Org]

---


