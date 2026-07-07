import { UserProps } from "@/types/user";
import { adminDb } from "@/utils/firebaseAdmin";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

// Define the type for the request body. Note: `user` is intentionally NOT read
// from the body — the author is always derived from the authenticated session
// to prevent identity spoofing.
interface RequestBody {
  projectId: string;
  comment: string;
  githubLink?: string;
  parentId?: string; // Add parentId for replies
}

const MAX_COMMENT_LENGTH = 1000;

// Only accept GitHub https URLs (or an empty value for replies). This blocks
// dangerous schemes like javascript: / data: from being stored and later
// rendered into an href (stored XSS).
function isValidGithubLink(link: string): boolean {
  if (link === "") return true;
  try {
    const url = new URL(link);
    return url.protocol === "https:" && url.hostname === "github.com";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - You must be signed in to comment" },
        { status: 401 }
      );
    }

    const { projectId, comment, githubLink, parentId }: RequestBody =
      await request.json();

    // Validate projectId
    if (typeof projectId !== "string" || projectId.trim() === "") {
      return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    }

    // Validate comment
    if (typeof comment !== "string" || comment.trim() === "") {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }
    if (comment.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        { error: `Comment exceeds ${MAX_COMMENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Validate githubLink scheme (defense against stored XSS)
    const safeGithubLink = githubLink ?? "";
    if (!isValidGithubLink(safeGithubLink)) {
      return NextResponse.json(
        { error: "githubLink must be a valid https://github.com URL" },
        { status: 400 }
      );
    }

    // Derive the author from the session — never trust a client-supplied identity.
    const user: UserProps = {
      aud: session.user.email,
      id: session.user.email,
      image: session.user.image ?? "",
      name: session.user.name ?? "",
    };

    // Prepare document data, only include parentId if it's defined
    const docData: {
      projectId: string;
      user: UserProps;
      comment: string;
      githubLink: string;
      timestamp: Date;
      parentId?: string;
    } = {
      projectId,
      user,
      comment,
      githubLink: safeGithubLink,
      timestamp: new Date(),
    };

    // Only add parentId if it's not undefined (for replies)
    if (parentId !== undefined && parentId !== null) {
      docData.parentId = parentId;
    }

    const docRef = await adminDb.collection("projectsComments").add(docData);

    return NextResponse.json(
      { id: docRef.id, message: "Document added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    return NextResponse.json(
      { error: "Failed to add document" },
      { status: 500 }
    );
  }
}
