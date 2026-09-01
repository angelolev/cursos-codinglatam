"use client";
import { useEffect } from "react";

// Primitivas UI compartidas por las landings con look & feel de Claude Code
// (/claude y /claude-no-programadores). Las primitivas viven en ./primitives
// para que también puedan importarse desde server components.

export * from "./primitives";

// Scroll-reveal: anima los hijos directos del contenedor al entrar al viewport.
// El estado oculto se setea en JS para que sin JS todo sea visible.
export function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const items = Array.from(root.children) as HTMLElement[];
    items.forEach((el, i) => {
      el.classList.add("reveal-init");
      el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("reveal-in");
            el.classList.remove("reveal-init");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}
