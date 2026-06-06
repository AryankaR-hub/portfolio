export interface Project {
  id: number;
  emoji: string;
  name: string;
  description: string;
  tech: string[];
  link: string;
  side: "left" | "right";
  roadPosition: number; // 0.0 to 1.0
}

// ✏️ EDIT THESE with your real projects
export const projects: Project[] = [
  {
    id: 1,
    emoji: "🌦️",
    name: "Weather App",
    description: "Real-time weather with location detection and clean UI",
    tech: ["React", "OpenWeather API", "CSS"],
    link: "https://your-link-here.vercel.app",
    side: "right",
    roadPosition: 0.22,
  },
  {
    id: 2,
    emoji: "✅",
    name: "Task Manager",
    description: "Full-stack productivity app with auth and live sync",
    tech: ["Next.js", "MongoDB", "Tailwind"],
    link: "https://your-link-here.vercel.app",
    side: "left",
    roadPosition: 0.45,
  },
  {
    id: 3,
    emoji: "💬",
    name: "Chat App",
    description: "Real-time messaging with rooms and online presence",
    tech: ["Socket.io", "Node.js", "React"],
    link: "https://your-link-here.vercel.app",
    side: "right",
    roadPosition: 0.67,
  },
  {
    id: 4,
    emoji: "🛒",
    name: "E-Commerce",
    description: "Full shopping experience with cart and payments",
    tech: ["Next.js", "Stripe", "PostgreSQL"],
    link: "https://your-link-here.vercel.app",
    side: "left",
    roadPosition: 0.88,
  },
];