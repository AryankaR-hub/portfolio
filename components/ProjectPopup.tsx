"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/projectData";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectPopup({ project, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (project) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [project]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,4,10,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#10101c",
          border: "1px solid #ff6b2b88",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          width: 360,
          maxWidth: "90vw",
          textAlign: "center",
          boxShadow: "0 0 100px #ff6b2b22, 0 0 40px #ff6b2b11",
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: "absolute",
          top: 0, left: "20%", right: "20%",
          height: 1,
          background: "linear-gradient(to right, transparent, #ff6b2b, transparent)",
        }} />

        {/* Project number */}
        <div style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "#ff6b2b55",
          letterSpacing: "0.3em",
          marginBottom: 16,
          textTransform: "uppercase",
        }}>
          project · {String(project.id).padStart(2, "0")}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 48, marginBottom: 16, lineHeight: 1 }}>
          {project.emoji}
        </div>

        {/* Name */}
        <h2 style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#f0ece4",
          marginBottom: 10,
          letterSpacing: "-0.02em",
        }}>
          {project.name}
        </h2>

        {/* Description */}
        <p style={{
          fontFamily: "var(--mono)",
          fontSize: 13,
          color: "#666",
          lineHeight: 1.7,
          marginBottom: 20,
          padding: "0 1rem",
        }}>
          {project.description}
        </p>

        {/* Tech tags */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          marginBottom: 28,
        }}>
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "#ff6b2bcc",
              border: "1px solid #ff6b2b33",
              borderRadius: 20,
              padding: "5px 14px",
              letterSpacing: "0.08em",
              background: "#ff6b2b08",
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <ViewButton onClick={() => window.open(project.link, "_blank")} />
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#444",
              border: "1px solid #222",
              padding: "12px 20px",
              borderRadius: 30,
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#888";
              e.currentTarget.style.borderColor = "#444";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#444";
              e.currentTarget.style.borderColor = "#222";
            }}
          >
            close ×
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#ff7d42" : "#ff6b2b",
        color: "#07070f",
        padding: "12px 28px",
        borderRadius: 30,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.04em",
        boxShadow: hover ? "0 0 40px #ff6b2b88" : "0 0 20px #ff6b2b44",
        transform: hover ? "scale(1.05)" : "scale(1)",
        transition: "all 0.18s ease",
      }}
    >
      View Project ↗
    </button>
  );
}