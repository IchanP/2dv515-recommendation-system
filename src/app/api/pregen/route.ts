// app/api/generate/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    jwt.verify(token as string, process.env.SESSION_SECRET as string);

    // TODO Do I return the table here?
    const generatedData = "TODO return the table";
    return NextResponse.json({ message: generatedData });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
