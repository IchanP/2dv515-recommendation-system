import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const correctPw = process.env.ADMIN_PW;
  const body = await request.json();
  if (correctPw === body.password) {
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 },
    );
    response.cookies.set("session", "loggedIn", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ message: "Invalid password" }, { status: 401 });
}
