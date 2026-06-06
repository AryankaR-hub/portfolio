"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { projects, Project } from "@/lib/projectData";
import { useKeyboard } from "@/hooks/useKeyboard";
import ProjectPopup from "./ProjectPopup";

// Stars generated once
const BG_STARS = Array.from({ length: 160 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 56,
  size: Math.random() * 2.4 + 0.3,
  opacity: Math.random() * 0.8 + 0.1,
  dur: Math.random() * 5 + 2,
  delay: Math.random() * 6,
  gold: Math.random() > 0.85,
}));

const NEBULAS = [
  { x: 15, y: 10, w: 200, h: 120, color: "#ff6b2b06" },
  { x: 65, y: 5, w: 160, h: 100, color: "#3b82f608" },
  { x: 80, y: 35, w: 180, h: 90, color: "#8b5cf608" },
];

const ROAD_W = 160;
const STEP = 0.016;
const MIN_Y = 0.08;
const MAX_Y = 0.92;
const NEAR_THRESHOLD = 0.09;

export default function GameCanvas() {
  const [avatarY, setAvatarY] = useState(0.08);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [nearId, setNearId] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [footStep, setFootStep] = useState(0);
  const movingRef = useRef(false);
  const footTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const moveUp = useCallback(() => {
    setAvatarY(y => Math.max(MIN_Y, y - STEP));
    if (!movingRef.current) {
      movingRef.current = true;
      setIsMoving(true);
    }
  }, []);

  const moveDown = useCallback(() => {
    setAvatarY(y => Math.min(MAX_Y, y + STEP));
    if (!movingRef.current) {
      movingRef.current = true;
      setIsMoving(true);
    }
  }, []);

  useKeyboard(moveUp, moveDown, !activeProject);

  // Footstep animation
  useEffect(() => {
    if (isMoving) {
      footTimerRef.current = setInterval(() => {
        setFootStep(f => (f + 1) % 2);
      }, 180);
    } else {
      clearInterval(footTimerRef.current);
      setFootStep(0);
    }
    return () => clearInterval(footTimerRef.current);
  }, [isMoving]);

  // Stop moving after keys released
  useEffect(() => {
    movingRef.current = false;
    const t = setTimeout(() => setIsMoving(false), 120);
    return () => clearTimeout(t);
  }, [avatarY]);

  // Proximity check
  useEffect(() => {
    const near = projects.find(p => Math.abs(avatarY - p.roadPosition) < NEAR_THRESHOLD);
    setNearId(near?.id ?? null);
  }, [avatarY]);

  const handleProjectClick = (p: Project) => {
    if (Math.abs(avatarY - p.roadPosition) < NEAR_THRESHOLD + 0.04) {
      setActiveProject(p);
    }
  };

  // Parallax: distant things move slower
  const parallaxOffset = (avatarY - 0.5) * 0;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      position: "relative",
      overflow: "hidden",
      background: "#07070f",
    }}>

      {/* === SKY === */}
      <div style={{
        position: "absolute",
        inset: 0,
        bottom: "44%",
        background: "linear-gradient(to bottom, #03030a 0%, #08101e 50%, #0a1208 100%)",
      }} />

      {/* Nebula blobs */}
      {NEBULAS.map((n, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${n.x}%`,
          top: `${n.y}%`,
          width: n.w,
          height: n.h,
          background: n.color,
          filter: "blur(40px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
      ))}

      {/* Stars */}
      <div style={{ position: "absolute", inset: "0 0 44% 0", pointerEvents: "none" }}>
        {BG_STARS.map(s => (
          <div key={s.id} style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.gold ? "#ffd700" : "#ffffff",
            opacity: s.opacity,
            animation: `twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>

      {/* Moon */}
      <div style={{
        position: "absolute",
        top: "6%",
        right: "12%",
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#fff8dc",
        boxShadow: "0 0 40px #fff8dc44, 0 0 80px #fff8dc22",
        pointerEvents: "none",
      }}>
        {/* Crater */}
        <div style={{
          position: "absolute",
          top: "25%", left: "20%",
          width: 10, height: 10,
          borderRadius: "50%",
          background: "#f0e68c44",
        }} />
        <div style={{
          position: "absolute",
          top: "55%", left: "55%",
          width: 7, height: 7,
          borderRadius: "50%",
          background: "#f0e68c33",
        }} />
      </div>

      {/* === GROUND === */}
      <div style={{
        position: "absolute",
        inset: "56% 0 0 0",
        background: "linear-gradient(to bottom, #0a100a 0%, #060b06 100%)",
      }} />

      {/* Ground detail lines */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute",
          top: `${58 + i * 10}%`,
          left: 0, right: 0,
          height: 1,
          background: "#ffffff04",
        }} />
      ))}

      {/* Distant trees silhouette */}
      <TreeSilhouette />

      {/* === ROAD === */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 0, bottom: 0,
        width: ROAD_W,
        transform: "translateX(-50%)",
        background: "#111118",
        borderLeft: "2px solid #ff6b2b1a",
        borderRight: "2px solid #ff6b2b1a",
      }}>
        {/* Road texture lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 28px, #ffffff04 28px, #ffffff04 29px)",
        }} />

        {/* Center dashes */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} style={{
            position: "absolute",
            left: "50%",
            top: `${i * 13}%`,
            transform: "translateX(-50%)",
            width: 4,
            height: 28,
            background: "linear-gradient(to bottom, #ff6b2b66, #ff6b2b11)",
            borderRadius: 3,
            animation: `dashScroll 1.4s linear infinite`,
            animationDelay: `${i * 0.175}s`,
          }} />
        ))}

        {/* Road edge glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 4px 0 12px #ff6b2b08, inset -4px 0 12px #ff6b2b08",
        }} />
      </div>

      {/* Road glow on ground */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "55%", bottom: 0,
        width: ROAD_W + 60,
        transform: "translateX(-50%)",
        background: "radial-gradient(ellipse at top, #ff6b2b06 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* === PROJECT CARDS === */}
      {projects.map(p => (
        <ProjectCard
          key={p.id}
          project={p}
          isNear={nearId === p.id}
          onClick={() => handleProjectClick(p)}
        />
      ))}

      {/* === AVATAR === */}
      <Avatar avatarY={avatarY} isMoving={isMoving} footStep={footStep} />

      {/* === HUD === */}
      <HUD avatarY={avatarY} nearId={nearId} />

      {/* === POPUP === */}
      {activeProject && (
        <ProjectPopup
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: inherit; }
          50% { opacity: 0.04; }
        }
        @keyframes dashScroll {
          0% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
          100% { transform: translateX(-50%) translateY(80px); opacity: 0; }
        }
        @keyframes cardPulse {
          0%, 100% { box-shadow: 0 0 20px #ff6b2b33; }
          50% { box-shadow: 0 0 40px #ff6b2b66; }
        }
        @keyframes bobIdle {
          0% { transform: translate(-50%, -50%) scaleY(1); }
          100% { transform: translate(-50%, -54%) scaleY(0.96); }
        }
        @keyframes walkA {
          0% { transform: translate(-50%, -50%) rotate(-3deg); }
          100% { transform: translate(-50%, -50%) rotate(3deg); }
        }
        @keyframes connectorPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ---- Sub-components ----

function Avatar({ avatarY, isMoving, footStep }: {
  avatarY: number;
  isMoving: boolean;
  footStep: number;
}) {
  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: `${avatarY * 100}%`,
      transform: "translate(-50%, -50%)",
      zIndex: 50,
      transition: "top 0.06s linear",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Player body */}
      <div style={{
        fontSize: 34,
        filter: "drop-shadow(0 0 12px #ff6b2bbb) drop-shadow(0 4px 8px #00000088)",
        animation: isMoving
          ? `walkA 0.36s ease-in-out infinite alternate`
          : `bobIdle 1s ease-in-out infinite alternate`,
        lineHeight: 1,
      }}>
        🏃
      </div>

      {/* Basketball beside player when idle */}
      {!isMoving && (
        <div style={{
          position: "absolute",
          right: -22,
          top: 4,
          fontSize: 16,
          animation: "bobIdle 0.6s ease-in-out infinite alternate",
          filter: "drop-shadow(0 0 6px #ff6b2b88)",
        }}>
          🏀
        </div>
      )}

      {/* Shadow */}
      <div style={{
        width: 28,
        height: 5,
        background: "#000000",
        borderRadius: "50%",
        opacity: 0.35,
        marginTop: 1,
        filter: "blur(3px)",
        transform: `scaleX(${isMoving ? 0.7 : 1})`,
        transition: "transform 0.1s",
      }} />
    </div>
  );
}

function ProjectCard({ project, isNear, onClick }: {
  project: Project;
  isNear: boolean;
  onClick: () => void;
}) {
  const ROAD_HALF = ROAD_W / 2;
  const GAP = 18;

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        top: `${project.roadPosition * 100}%`,
        ...(project.side === "right"
          ? { left: `calc(50% + ${ROAD_HALF + GAP}px)` }
          : { right: `calc(50% + ${ROAD_HALF + GAP}px)` }
        ),
        transform: `translateY(-50%) scale(${isNear ? 1.05 : 1})`,
        width: 150,
        background: isNear ? "#1a100a" : "#0e0e18",
        border: `1px solid ${isNear ? "#ff6b2b" : "#ff6b2b22"}`,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: isNear ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: isNear ? "cardPulse 1.5s ease-in-out infinite" : "none",
        zIndex: 30,
      }}
    >
      {/* Connector line to road */}
      <div style={{
        position: "absolute",
        top: "50%",
        ...(project.side === "right"
          ? { right: "100%", width: GAP }
          : { left: "100%", width: GAP }
        ),
        height: 1,
        background: isNear
          ? "linear-gradient(to right, #ff6b2b, #ff6b2b88)"
          : "#ff6b2b18",
        animation: isNear ? "connectorPulse 1s ease-in-out infinite" : "none",
        transition: "background 0.3s",
      }} />

      {/* Top indicator dot */}
      <div style={{
        position: "absolute",
        top: -4, left: "50%",
        transform: "translateX(-50%)",
        width: 8, height: 8,
        borderRadius: "50%",
        background: isNear ? "#ff6b2b" : "#ff6b2b33",
        boxShadow: isNear ? "0 0 10px #ff6b2b" : "none",
        transition: "all 0.3s",
      }} />

      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 9,
        color: "#ff6b2b88",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}>
        {String(project.id).padStart(2, "0")} · project
      </div>

      <div style={{ fontSize: 22, marginBottom: 5, lineHeight: 1 }}>
        {project.emoji}
      </div>

      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: isNear ? "#f0ece4" : "#666",
        marginBottom: 4,
        transition: "color 0.3s",
        lineHeight: 1.2,
      }}>
        {project.name}
      </div>

      {/* Tech preview */}
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 9,
        color: "#ff6b2b55",
        letterSpacing: "0.06em",
        marginBottom: isNear ? 8 : 0,
      }}>
        {project.tech.slice(0, 2).join(" · ")}
      </div>

      {/* Click prompt */}
      {isNear && (
        <div style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "#ff6b2b",
          letterSpacing: "0.1em",
          animation: "connectorPulse 0.8s ease-in-out infinite",
          paddingTop: 2,
          borderTop: "1px solid #ff6b2b22",
        }}>
          click to open ↗
        </div>
      )}
    </div>
  );
}

function HUD({ avatarY, nearId }: { avatarY: number; nearId: number | null }) {
  const progress = Math.round(((avatarY - 0.08) / (0.92 - 0.08)) * 100);

  return (
    <>
      {/* Top left: back + name */}
      <div style={{
        position: "absolute",
        top: 20, left: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        zIndex: 100,
      }}>
        <a href="/" style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "#333",
          letterSpacing: "0.15em",
          transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ff6b2b")}
          onMouseLeave={e => (e.currentTarget.style.color = "#333")}
        >
          ← back
        </a>
      </div>

      {/* Top right: your name */}
      <div style={{
        position: "absolute",
        top: 20, right: 24,
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "#ff6b2b88",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        zIndex: 100,
      }}>
        YOUR NAME {/* ✏️ change */}
      </div>

      {/* Progress bar — right side */}
      <div style={{
        position: "absolute",
        right: 20,
        top: "15%", bottom: "15%",
        width: 2,
        background: "#ffffff08",
        borderRadius: 2,
        zIndex: 100,
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          height: `${progress}%`,
          width: "100%",
          background: "linear-gradient(to bottom, #ff6b2b, #ff6b2b44)",
          borderRadius: 2,
          transition: "height 0.1s",
        }} />
        {/* Thumb */}
        <div style={{
          position: "absolute",
          top: `${progress}%`,
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 8, height: 8,
          borderRadius: "50%",
          background: "#ff6b2b",
          boxShadow: "0 0 8px #ff6b2b",
          transition: "top 0.1s",
        }} />
      </div>

      {/* Progress label */}
      <div style={{
        position: "absolute",
        right: 32, bottom: "14%",
        fontFamily: "var(--mono)",
        fontSize: 9,
        color: "#ff6b2b55",
        letterSpacing: "0.12em",
        zIndex: 100,
      }}>
        {progress}%
      </div>

      {/* Bottom controls hint */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "#2a2a33",
        letterSpacing: "0.15em",
        whiteSpace: "nowrap",
        zIndex: 100,
      }}>
        {nearId
          ? "🏀  you're close — click the card to open"
          : "↑ ↓  arrow keys to move · approach a project card"}
      </div>

      {/* Project count top center */}
      <div style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "#2a2a33",
        letterSpacing: "0.18em",
        zIndex: 100,
        whiteSpace: "nowrap",
      }}>
        {projects.length} projects down the road
      </div>
    </>
  );
}

function TreeSilhouette() {
  // Simple CSS tree shapes at horizon
  const trees = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i / 18) * 100,
    h: Math.random() * 40 + 30,
    w: Math.random() * 12 + 8,
    offset: Math.random() * 3,
  }));

  return (
    <div style={{
      position: "absolute",
      top: "calc(56% - 48px)",
      left: 0, right: 0,
      height: 50,
      display: "flex",
      alignItems: "flex-end",
      pointerEvents: "none",
      zIndex: 2,
    }}>
      {trees.map(t => (
        <div key={t.id} style={{
          position: "absolute",
          left: `${t.x}%`,
          bottom: 0,
          width: t.w,
          height: t.h,
          background: "#050a05",
          borderRadius: `${t.w * 0.8}px ${t.w * 0.8}px 0 0`,
        }} />
      ))}
    </div>
  );
}