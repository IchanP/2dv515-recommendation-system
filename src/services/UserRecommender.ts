import { CSVPrcessor } from "./CSVProcessor";
import {
  buildRatingsMapGeneric,
  calculateRecommendations,
  euclidieanSimilarity,
  RatingsMap,
} from "@/util";
import { getMovies, getRatings } from "./CSVReader";
import { MovieMapper } from "./MovieMapper";

export class UserRecommender {
  processor = new CSVPrcessor();
  movieMapper = new MovieMapper();

  async getRecommendations(userId: string, nrOfResults: number) {
    const ratings = await getRatings();
    const map = buildRatingsMapGeneric(ratings, "UserId", "MovieId", "Rating");
    const similarities = await this.calculateSimilarities(userId, map);
    // This assumes that the array is already sorted in descending order
    const recommendations = calculateRecommendations(
      userId,
      map,
      similarities,
    ).slice(0, nrOfResults);
    const movies = await getMovies();
    return this.movieMapper.insertTitleToMovie(recommendations, movies);
  }

  private async calculateSimilarities(user: string, map: RatingsMap) {
    const similarities: Similarity[] = [];

    for (const otherUser in map) {
      if (otherUser === user) continue;

      const similarity = euclidieanSimilarity(user, otherUser, map);
      similarities.push({
        itemA: user,
        itemB: otherUser,
        similarity: Number(similarity),
      });
    }

    return similarities.filter((e) => {
      return e.similarity > 0;
    });
  }
}
