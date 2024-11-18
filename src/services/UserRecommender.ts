import { CSVPrcessor } from "./CSVProcessor";
import {
  buildRatingsMap,
  calculateUserRecommendation,
  euclidieanSimilarity,
  RatingsMap,
} from "@/util";
import { getMovies, getRatings } from "./CSVReader";
import { MovieMapper } from "./MovieMapper";

export class UserRecommender {
  processor = new CSVPrcessor();
  movieMapper = new MovieMapper();
  userId: string;
  simType: AcceptableUserRecommendTypes;
  constructor(userId: string, simType: AcceptableUserRecommendTypes) {
    this.userId = userId;
    this.simType = simType;
  }

  async getRecommendations(nrOfResults: number) {
    const ratings = await getRatings();
    const map = buildRatingsMap(ratings, "UserId", "MovieId", "Rating");
    const similarities = await this.calculateSimilarities(map);

    // This assumes that the array is already sorted in descending order
    const recommendations = calculateUserRecommendation(
      this.userId,
      map,
      similarities,
    ).slice(0, nrOfResults);

    const movies = await getMovies();
    return this.movieMapper.insertTitleToMovie(recommendations, movies);
  }

  private async calculateSimilarities(map: RatingsMap) {
    const similarities: Similarity[] = [];

    for (const otherUser in map) {
      if (otherUser === this.userId) continue;
      // TODO this needs to either do euclidean or pearson depedning on the simType value
      const similarity = euclidieanSimilarity(this.userId, otherUser, map);

      similarities.push({
        itemA: this.userId,
        itemB: otherUser,
        similarity: Number(similarity),
      });
    }

    return similarities.filter((e) => {
      return e.similarity > 0;
    });
  }
}
