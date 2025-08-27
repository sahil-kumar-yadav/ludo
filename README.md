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


