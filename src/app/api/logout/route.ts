import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Eliminar la cookie estableciendo su expiración en el pasado
  response.cookies.set("auth-token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    expires: new Date(0), // Fecha pasada
  });

  return response;
}
