import type { MetadataRoute } from "next";

const SITE_URL = "https://codinglatam.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/authenticated areas out of the index.
      disallow: [
        "/admin",
        "/api/",
        "/perfil",
        "/profile",
        "/login",
        // Páginas de agradecimiento post-checkout de Hotmart (una por
        // estado de la compra): solo deben encontrarse siguiendo el
        // redirect real desde Hotmart, nunca por navegación directa.
        "/gracias-negocios-3aac2938a808",
        "/gracias-negocios-espera-566dbdcd84c3",
        "/gracias-negocios-analisis-f3209bd6a423",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
