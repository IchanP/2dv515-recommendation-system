import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ message: "fetched data" }, { status: 200 });
  } catch (e: unknown) {
    console.log(e); // Should go to logger really but whatever for this assignment
    return NextResponse.json(
      { message: "Something went wrong on the server" },
      { status: 500 },
    );
  }
}
