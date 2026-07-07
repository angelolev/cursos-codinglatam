import type { MetadataRoute } from "next";
import {
  getCourses,
  getWorkshops,
  getStarterRepos,
} from "@/utils/common";

const SITE_URL = "https://codinglatam.dev";

// Revalidate the sitemap daily so new courses/workshops appear without a deploy.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public, indexable static pages (premium-gated detail pages are excluded
  // because they redirect unauthenticated crawlers to /pro).
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/pro",
    "/cursos",
    "/workshops",
    "/proyectos",
    "/guias",
    "/en-vivo",
    "/repositorios",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Dynamic detail pages that are publicly reachable. Each fetch is guarded so a
  // single Firestore failure degrades gracefully instead of breaking the sitemap.
  const [courses, workshops, repos] = await Promise.all([
    getCourses().catch(() => null),
    getWorkshops().catch(() => null),
    getStarterRepos().catch(() => null),
  ]);

  const courseRoutes: MetadataRoute.Sitemap = (courses ?? []).map((c) => ({
    url: `${SITE_URL}/cursos/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const workshopRoutes: MetadataRoute.Sitemap = (workshops ?? []).map((w) => ({
    url: `${SITE_URL}/workshops/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const repoRoutes: MetadataRoute.Sitemap = (repos ?? []).map((r) => ({
    url: `${SITE_URL}/repositorios/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...workshopRoutes, ...repoRoutes];
}
