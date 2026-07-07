import type { MetadataRoute } from "next";

const SITE_URL = "https://codinglatam.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/authenticated areas out of the index.
      disallow: ["/admin", "/api/", "/perfil", "/profile", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
