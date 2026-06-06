"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Generate stars once outside component so they don't re-randomize
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.2 + 0.4,
  opacity: Math.random() * 0.7 + 0.15,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 5,
}));

const SHOOTING_STARS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  startX: Math.random() * 60 + 10,
  startY: Math.random() * 30,
  duration: Math.random() * 1.5 + 1,
  delay: Math.random() * 8 + i * 3,
}));

export default function IntroScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<"loading" | "visible" | "leaving">("loading");
  const [ballY, setBallY] = useState(0);
  const ballRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 120);
    return () => clearTimeout(t);
  }, []);

  // Smooth ball bounce animation
  useEffect(() => {
    let start: number;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1000;
      // Parabolic bounce: goes up then snaps down
      const cycle = elapsed % 0.7;
      const t = cycle / 0.7;
      const y = t < 0.5
        ? -Math.sin(t * Math.PI) * 22
        : -Math.sin(t * Math.PI) * 22;
      setBallY(y);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const enter = () => {
    setPhase("leaving");
    setTimeout(() => router.push("/portfolio"), 600);
  };

  const isVisible = phase === "visible" || phase === "leaving";
  const isLeaving = phase === "leaving";

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, #0d1a2e 0%, #07070f 60%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      opacity: isLeaving ? 0 : 1,
      transition: "opacity 0.6s ease",
    }}>

      {/* Star field */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.size > 1.8 ? "#ffd700" : "#ffffff",
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}

        {/* Shooting stars */}
        {SHOOTING_STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.startX}%`,
            top: `${s.startY}%`,
            width: 80,
            height: 1.5,
            background: "linear-gradient(to right, transparent, #ffffff, transparent)",
            borderRadius: 4,
            opacity: 0,
            animation: `shoot ${s.duration}s ease-out infinite`,
            animationDelay: `${s.delay}s`,
            transform: "rotate(-20deg)",
          }} />
        ))}
      </div>

      {/* Ambient glows */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, #ff6b2b0a 0%, transparent 70%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, #3b82f60a 0%, transparent 70%)",
        top: "-10%", right: "-5%",
        pointerEvents: "none",
      }} />

      {/* Basketball */}
      <div style={{
        transform: `translateY(${ballY}px)`,
        fontSize: 52,
        marginBottom: 28,
        filter: "drop-shadow(0 12px 20px #ff6b2b66)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s",
        position: "relative",
        zIndex: 2,
      }}>
        🏀
        {/* Shadow under ball */}
        <div style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 30 + Math.abs(ballY) * 0.5,
          height: 6,
          background: "#ff6b2b22",
          borderRadius: "50%",
          filter: "blur(4px)",
        }} />
      </div>

      {/* Mono tag */}
      <p style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "#ff6b2b",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        marginBottom: 32,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.7s 0.15s ease",
        position: "relative", zIndex: 2,
      }}>
        — developer · portfolio —
      </p>

      {/* Main quote */}
      <div style={{
        textAlign: "center",
        maxWidth: 640,
        padding: "0 2rem",
        marginBottom: 52,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        transition: "all 0.9s 0.3s ease",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          fontSize: 90,
          lineHeight: 0.55,
          color: "#ff6b2b",
          fontWeight: 800,
          opacity: 0.5,
          marginBottom: 16,
        }}>"</div>

        {/* ✏️ CHANGE THIS QUOTE */}
        <h1 style={{
          fontSize: "clamp(26px, 5.5vw, 48px)",
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: "-0.03em",
          color: "#f0ece4",
        }}>
          I don't just write code.
          <br />
          I build things that{" "}
          <span style={{
            color: "#ff6b2b",
            position: "relative",
            display: "inline-block",
          }}>
            feel alive.
            <span style={{
              position: "absolute",
              bottom: -3, left: 0, right: 0,
              height: 2,
              background: "#ff6b2b55",
              borderRadius: 2,
            }} />
          </span>
        </h1>

        {/* ✏️ CHANGE YOUR NAME & TITLE */}
        <p style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "#555",
          marginTop: 24,
          letterSpacing: "0.1em",
        }}>
          — Your Name &nbsp;·&nbsp; Full Stack Developer
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.9s 0.55s ease",
        position: "relative", zIndex: 2,
      }}>
        <EnterButton onClick={enter} />

        <button
          onClick={enter}
          style={{
            background: "transparent",
            color: "#3a3a44",
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.18em",
            transition: "color 0.2s",
            padding: "4px 8px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#666")}
          onMouseLeave={e => (e.currentTarget.style.color = "#3a3a44")}
        >
          skip intro
        </button>
      </div>

      {/* Social links bottom */}
      <div style={{
        position: "absolute",
        bottom: 28,
        display: "flex",
        gap: 32,
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "#333",
        letterSpacing: "0.15em",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s 0.8s",
        zIndex: 2,
      }}>
        {/* ✏️ CHANGE THESE LINKS */}
        {[
          { label: "github", href: "https://github.com/yourusername" },
          { label: "linkedin", href: "https://linkedin.com/in/yourusername" },
          { label: "twitter", href: "https://twitter.com/yourusername" },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ color: "#333", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ff6b2b")}
            onMouseLeave={e => (e.currentTarget.style.color = "#333")}
          >
            {s.label}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: inherit; transform: scale(1); }
          50% { opacity: 0.05; transform: scale(0.7); }
        }
        @keyframes shoot {
          0% { opacity: 0; transform: translateX(0) rotate(-20deg); }
          10% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(200px) translateY(80px) rotate(-20deg); }
        }
      `}</style>
    </div>
  );
}

function EnterButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#ff6b2b" : "transparent",
        color: hover ? "#07070f" : "#ff6b2b",
        border: "1.5px solid #ff6b2b",
        padding: "15px 52px",
        borderRadius: 50,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.06em",
        transition: "all 0.2s ease",
        boxShadow: hover
          ? "0 0 50px #ff6b2b88, inset 0 0 20px #ff6b2b22"
          : pulse
          ? "0 0 30px #ff6b2b44"
          : "0 0 20px #ff6b2b22",
        transform: hover ? "scale(1.04)" : "scale(1)",
      }}
    >
      Enter the Game ↓
    </button>
  );
}