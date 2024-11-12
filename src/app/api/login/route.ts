import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const correctPw = process.env.ADMIN_PW;
  const body = await request.json();
  if (correctPw === body.password) {
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 },
    );

    const token = jwt.sign(
      { userId: "admin" },
      process.env.ADMIN_SESSION as string,
      { expiresIn: "8h" },
    );

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return response;
  }
  return NextResponse.json({ message: "Invalid password" }, { status: 401 });
}
