import { buildRatingsMapGeneric } from "@/util";
import { getMovieSimilarities, getRatings } from "./CSVReader";

export class ItemRecommender {
  async getRecommendations(userId: number, nrOfResults: number) {
    const movieSimilarities = await getMovieSimilarities();
    const userRatings = await getRatings();
    const ourUserRatings = userRatings.filter(
      (rating) => Number(rating.UserId) === userId,
    );
    // TODO move this transpose function out to a different function and also make it
    //  more general so i can reuse it in user recommend
    const map = buildRatingsMapGeneric(
      ourUserRatings,
      "MovieId",
      "UserId",
      "Rating",
    );
    console.log(map);
  }
}
