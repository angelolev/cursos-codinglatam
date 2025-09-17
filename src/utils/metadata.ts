import type { Metadata } from "next";
import { CourseProps } from "@/types/course";
import { ProjectProps } from "@/types/project";
import { WorkshopProps } from "@/types/workshop";

const SITE_NAME = "Coding Latam";
const SITE_URL = "https://codinglatam.dev";
const DEFAULT_IMAGE = "https://codinglatam.dev/og.png";

export function generateSiteMetadata(): Metadata {
  return {
    title: {
      template: `%s | ${SITE_NAME}`,
      default: `Aprende a programar HACIENDO proyectos | ${SITE_NAME}`,
    },
    description: "Aprende HACIENDO proyectos REALES",
    openGraph: {
      title: SITE_NAME,
      description: "Aprende HACIENDO proyectos REALES",
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} og image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: "Aprende HACIENDO proyectos REALES",
      images: [DEFAULT_IMAGE],
    },
  };
}

export function generateCourseMetadata(course: CourseProps): Metadata {
  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      url: `${SITE_URL}/cursos/${course.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: course.image,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.shortDescription,
      images: [course.image],
    },
  };
}

export function generateProjectMetadata(project: ProjectProps): Metadata {
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${SITE_URL}/proyectos/${project.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export function generateWorkshopMetadata(workshop: WorkshopProps): Metadata {
  return {
    title: workshop.title,
    description: workshop.description,
    openGraph: {
      title: workshop.title,
      description: workshop.description,
      url: `${SITE_URL}/workshops/${workshop.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: workshop.image,
          width: 1200,
          height: 630,
          alt: workshop.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: workshop.title,
      description: workshop.description,
      images: [workshop.image],
    },
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path?: string
): Metadata {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_NAME}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGE],
    },
  };
}