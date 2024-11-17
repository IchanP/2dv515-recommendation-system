import { UserRecommender } from "@/services/UserRecommender";
import { recommendApiParamsValidation } from "@/util/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, nrOfResults } = recommendApiParamsValidation(request.url);

    const recommender = new UserRecommender();
    const recommendations = await recommender.getRecommendations(
      user,
      Number(nrOfResults),
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
