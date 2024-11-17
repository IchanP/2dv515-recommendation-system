import { buildRatingsMap, calculateRecommendations, RatingsMap } from "@/util";
import { getMovieSimilarities, getRatings } from "./CSVReader";

export class ItemRecommender {
  async getRecommendations(userId: number, nrOfResults: number) {
    const movieSimilarities = await getMovieSimilarities();
    const userRatings = await getRatings();
    const ourUserRatings = userRatings.filter(
      (rating) => Number(rating.UserId) === userId,
    );
    const map = buildRatingsMap(ourUserRatings, "MovieId", "UserId", "Rating");
    // Filter out the unseen movies from the comparison as they're uninteresting.
    const filtered = this.filterSimilarities(map, movieSimilarities);
    console.log(map);
    console.log(filtered);
    /*     const recommendations = calculateRecommendations("0", map, filtered);
     */
  }

  private filterSimilarities(map: RatingsMap, similarities: Similarity[]) {
    const keySet = new Set(Object.keys(map)); // Gives acces to has function
    return similarities.filter(
      (sim) => keySet.has(sim.itemA) && !keySet.has(sim.itemB),
    );
  }
}
