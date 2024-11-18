import { UserRecommender } from "@/services/UserRecommender";
import {
  recommendApiParamsValidation,
  simTypeParamValidation,
} from "@/util/validators";
import { NextRequest, NextResponse } from "next/server";

const acceptableSimTypes = {
  pearson: "Pearson",
  euclidean: "Euclidean",
};

export async function GET(request: NextRequest) {
  try {
    const { user, nrOfResults } = recommendApiParamsValidation(request.url);
    const simType = simTypeParamValidation(
      request.url,
      acceptableSimTypes,
    ) as AcceptableUserRecommendTypes; // Did it this way to keep the simTypeParamValdiation function general

    const recommender = new UserRecommender(user, simType);
    const recommendations = await recommender.getRecommendations(
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
