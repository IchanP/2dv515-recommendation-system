import { UserRecommend } from "@/services/UserRecommend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    const nrOfResults = searchParams.get("results");

    if (!user || !nrOfResults) throw new Error();

    const recommender = new UserRecommend();
    const recommendations = await recommender.getRecommendations(
      user,
      nrOfResults,
    );

    return NextResponse.json({ data: recommendations }, { status: 200 });
  } catch (e: unknown) {
    console.log(e); // Should go to logger really but whatever for this assignment
    return NextResponse.json(
      { message: "Something went wrong on the server" },
      { status: 500 },
    );
  }
}
