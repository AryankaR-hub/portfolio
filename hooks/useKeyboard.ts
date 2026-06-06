import { useEffect, useRef } from "react";

export function useKeyboard(
  onUp: () => void,
  onDown: () => void,
  enabled: boolean
) {
  const upRef = useRef(onUp);
  const downRef = useRef(onDown);

  useEffect(() => { upRef.current = onUp; downRef.current = onDown; });

  useEffect(() => {
    if (!enabled) return;

    const held: Record<string, boolean> = {};
    const interval = setInterval(() => {
      if (held["ArrowUp"]) upRef.current();
      if (held["ArrowDown"]) downRef.current();
    }, 45);

    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        held[e.key] = true;
      }
    };
    const up = (e: KeyboardEvent) => { held[e.key] = false; };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [enabled]);
}