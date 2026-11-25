import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CUPOS_TOTALES } from "./config";

export const alt = "Builders Lab — Deja de ver tutoriales. Empieza a construir con IA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir el enlace (WhatsApp, redes). Colores del sitio:
// fondo Eerie Black #171717 y acento #ecb033. Usa Fira Code, la fuente del
// sitio; next/og necesita los archivos .ttf (no acepta woff2), por eso viven
// en src/assets/fonts.
export default async function OpengraphImage() {
  const fontsDir = join(process.cwd(), "src/assets/fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, "FiraCode-Regular.ttf")),
    readFile(join(fontsDir, "FiraCode-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#171717",
          backgroundImage:
            "radial-gradient(circle at 50% -10%, rgba(236,176,51,0.28), rgba(23,23,23,0) 60%)",
          color: "white",
          fontFamily: "Fira Code",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              border: "2px solid rgba(228,145,28,0.6)",
              backgroundColor: "rgba(228,145,28,0.12)",
              color: "#ecb033",
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {`Conviértete en builder · Solo ${CUPOS_TOTALES} cupos`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            Builders&nbsp;<span style={{ color: "#ecb033" }}>Lab</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              fontSize: 42,
              lineHeight: 1.3,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span>Deja de ver tutoriales.</span>
            <span style={{ color: "white" }}>Empieza a construir con IA.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #3d3d3d",
            paddingTop: 32,
            fontSize: 24,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>
            Con Angelo Leva · Claude Certified Associate
          </span>
          <span style={{ color: "#ecb033", fontWeight: 700 }}>
            codinglatam.dev
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fira Code", data: regular, weight: 400, style: "normal" },
        { name: "Fira Code", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}
