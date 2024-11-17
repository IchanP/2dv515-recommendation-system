import { CSVPrcessor } from "./CSVProcessor";
import {
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
    console.log(ratings);
    const map = this.buildRatingsMap(ratings);
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
    const similarities: Similarities[] = [];

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

  // This is the exact same as in MovieTransposer
  // but I didn't have time to spend to generalize it for both use cases.
  private buildRatingsMap(ratings: UntransformedRatings[]) {
    const userRatings: RatingsMap = {};
    for (const rating of ratings) {
      const userId = rating.UserId;
      if (!userRatings[userId]) {
        userRatings[userId] = [];
      }
      userRatings[userId].push({
        raterId: rating.MovieId,
        rating: rating.Rating,
      });
    }
    return userRatings;
  }
}
