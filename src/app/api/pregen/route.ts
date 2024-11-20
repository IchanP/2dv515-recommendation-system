// app/api/generate/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PregenFacade } from "@/services/PregenFacade";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  try {
    jwt.verify(token as string, process.env.ADMIN_SESSION as string);

    const generator = new PregenFacade();

    await generator.generateTable();

    return NextResponse.json(
      {
        message: "Data saved to 'movie-similarities.csv",
      },
      { status: 200 },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
