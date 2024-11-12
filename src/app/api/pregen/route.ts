// app/api/generate/route.js

import { cookies } from "next/headers";

import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();

  const session = cookieStore.get("session");
  if (!session || session.value !== "loggedIn") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // TODO Do I return the table here?
  const generatedData = "TODO return the table";

  return NextResponse.json({ message: generatedData });
}
