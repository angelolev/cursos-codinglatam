// Tratamientos de acción compartidos por la barra de navegación y las
// superficies de marketing. Existen para que un mismo rol —acción principal,
// acción secundaria, foco de teclado— se vea igual en toda la app.
//
// Usan los tokens `primary-*` y no `--accent`: la barra vive fuera de `main`,
// donde `--accent` todavía es el terracota de las landings de Claude.

// El sistema pide foco ámbar visible: sobre el suelo #161616 el anillo por
// defecto del navegador es prácticamente invisible.
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200";

// Acción principal: relleno ámbar plano y texto carbón. Sin gradiente, brillo
// ni escala — el sistema construye la jerarquía con color, no con efectos.
export const ctaPrimary = `${base} group rounded-lg bg-primary-400 px-8 py-4 text-base text-[#1e1e1e] hover:bg-primary-300 ${focusRing}`;

// Variante compacta para el cromo de la barra de navegación.
export const ctaPrimaryCompact = `${base} rounded-md bg-primary-400 px-4 py-2 text-sm text-[#1e1e1e] hover:bg-primary-300 ${focusRing}`;

// Acción secundaria: superficie translúcida con hairline. Nunca toma el ámbar,
// para que en la misma pantalla haya una sola acción iluminada.
export const ctaSecondary = `${base} rounded-lg border border-white/15 bg-white/[0.03] px-8 py-4 text-base text-white/80 hover:border-white/30 hover:bg-white/[0.06] hover:text-white ${focusRing}`;

export const ctaSecondarySmall = `${base} rounded-lg border border-white/15 bg-white/[0.03] px-5 py-3 text-sm text-white/80 hover:border-white/30 hover:bg-white/[0.06] hover:text-white ${focusRing}`;
