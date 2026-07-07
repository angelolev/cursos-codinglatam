import { NextResponse } from "next/server";
import { adminDb, admin } from "@/utils/firebaseAdmin";
import { auth } from "@/app/auth";

const MAX_NAME_LENGTH = 50;
const MAX_GITHUB_LENGTH = 100;

// Only accept http(s) URLs for the GitHub link (or empty). Blocks dangerous
// schemes like javascript:/data: from being stored and later rendered as href.
function isValidGithubUrl(link: string): boolean {
  if (link === "") return true;
  try {
    const url = new URL(link);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

// PUT - Update the signed-in user's own profile.
// The target user doc is derived from the session (never from the body), and
// only safe fields (name, github) are written — isPremium and subscription data
// are never touched here, so a user cannot self-grant premium.
export async function PUT(request: Request) {
  try {
    const session = await auth();

    const userId = session?.user?.aud;
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - You must be signed in" },
        { status: 401 }
      );
    }

    const { name, github } = await request.json();

    if (typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name exceeds ${MAX_NAME_LENGTH} characters` },
        { status: 400 }
      );
    }

    const safeGithub = typeof github === "string" ? github.trim() : "";
    if (safeGithub.length > MAX_GITHUB_LENGTH) {
      return NextResponse.json(
        { error: `GitHub link exceeds ${MAX_GITHUB_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (!isValidGithubUrl(safeGithub)) {
      return NextResponse.json(
        { error: "GitHub link must be a valid http(s) URL" },
        { status: 400 }
      );
    }

    // Merge so isPremium / premiumSince / subscription fields are preserved.
    await adminDb.collection("users").doc(userId).set(
      {
        name: name.trim(),
        github: safeGithub,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
