"use client";
import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#07070f",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono', monospace",
      color: "#ff6b2b44",
      fontSize: 13, letterSpacing: "0.25em",
    }}>
      entering the game...
    </div>
  ),
});

export default function PortfolioPage() {
  return <GameCanvas />;
}