import LudoBoard from "@/components/LudoBoard";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Ludo</h1>
        <p className="text-gray-600">Next.js + Tailwind starter</p>
        <LudoBoard/>
        <div className="flex items-center justify-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-black text-white shadow hover:opacity-90 active:scale-95 transition">
            New Local Game
          </button>
          <button className="px-4 py-2 rounded-xl border shadow-sm hover:bg-gray-100 active:scale-95 transition">
            How to Play
          </button>
        </div>
      </div>
    </main>
  );
}
