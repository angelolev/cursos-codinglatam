import { ImageResponse } from "next/og";
import { CUPOS_TOTALES } from "./config";

export const alt = "Builders Lab — Un grupo exclusivo para aplicar IA de verdad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir el enlace (WhatsApp, redes). Colores del sitio:
// fondo Eerie Black #171717 y acento #ecb033.
export default function OpengraphImage() {
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
          fontFamily: "sans-serif",
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
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {`Pase Fundador · Solo ${CUPOS_TOTALES} cupos`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Builders&nbsp;<span style={{ color: "#ecb033" }}>Lab</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 46,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Un grupo exclusivo para aplicar IA de verdad.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #3d3d3d",
            paddingTop: 32,
            fontSize: 30,
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
    size
  );
}
