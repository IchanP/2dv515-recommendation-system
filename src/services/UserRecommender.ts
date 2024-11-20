import { CSVPrcessor } from "./CSVProcessor";
import { buildRatingsMap, calculateUserRecommendation } from "@/util";
import {
  euclidieanSimilarity,
  pearsonSimilarity,
} from "@/util/SimilarityCalculators";
import { getMovies, getRatings } from "./CSVReader";
import { MovieMapper } from "./MovieMapper";
import { isEuclideanType } from "@/util/TypeGuards";

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

      const similarity = isEuclideanType(this.simType)
        ? euclidieanSimilarity(this.userId, otherUser, map)
        : pearsonSimilarity(this.userId, otherUser, map);

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
