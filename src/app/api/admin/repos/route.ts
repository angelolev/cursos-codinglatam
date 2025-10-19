import { NextResponse } from "next/server";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { auth } from "@/app/auth";
import { generateSlug } from "@/utils/slugify";

const ADMIN_EMAIL = "angelokta7@gmail.com";

// POST - Create new repository
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.githubUrl || !data.thumbnail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = generateSlug(data.title);

    // Prepare repository data
    const repoData = {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription || "",
      githubUrl: data.githubUrl,
      thumbnail: data.thumbnail,
      stack: data.stack || [],
      difficulty: data.difficulty,
      category: data.category,
      features: data.features || [],
      isPremium: data.isPremium || false,
      slug: slug,
      setupTime: data.setupTime || "",
      demoUrl: data.demoUrl || "",
      readme: data.readme || "",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "starterRepos"), repoData);

    return NextResponse.json(
      {
        id: docRef.id,
        slug: slug,
        message: "Repository created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating repository:", error);
    return NextResponse.json(
      { error: "Failed to create repository" },
      { status: 500 }
    );
  }
}

// GET - List all repositories
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const reposCollection = collection(db, "starterRepos");
    const querySnapshot = await getDocs(reposCollection);

    const repos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ repos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

// PUT - Update repository
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Repository ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.githubUrl || !data.thumbnail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title (in case title changed)
    const slug = generateSlug(data.title);

    // Prepare repository data
    const repoData = {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription || "",
      githubUrl: data.githubUrl,
      thumbnail: data.thumbnail,
      stack: data.stack || [],
      difficulty: data.difficulty,
      category: data.category,
      features: data.features || [],
      isPremium: data.isPremium || false,
      slug: slug,
      setupTime: data.setupTime || "",
      demoUrl: data.demoUrl || "",
      readme: data.readme || "",
      updatedAt: new Date(),
    };

    const docRef = doc(db, "starterRepos", id);
    await updateDoc(docRef, repoData);

    return NextResponse.json(
      {
        id: id,
        slug: slug,
        message: "Repository updated successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating repository:", error);
    return NextResponse.json(
      { error: "Failed to update repository" },
      { status: 500 }
    );
  }
}

// DELETE - Delete repository
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Repository ID is required" },
        { status: 400 }
      );
    }

    await deleteDoc(doc(db, "starterRepos", id));

    return NextResponse.json(
      { message: "Repository deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting repository:", error);
    return NextResponse.json(
      { error: "Failed to delete repository" },
      { status: 500 }
    );
  }
}
