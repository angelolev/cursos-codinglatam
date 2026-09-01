"use client";
import { useRef } from "react";
import { useScrollReveal } from "@/components/claude-brochure";

// Envuelve una sección del home y anima sus hijos directos al entrar al viewport.
export default function Reveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  return (
    <section ref={ref} id={id} className={`scroll-mt-28 ${className}`}>
      {children}
    </section>
  );
}
