import { CSVPrcessor } from "./CSVProcessor";
import { euclidieanSimilarity, RatingsMap } from "@/util";
import { UntransformedRatings } from "./MovieTransposer";
import { getMovies, getRatings } from "./CSVReader";
import { MovieMapper } from "./MovieMapper";

declare type Similarities = {
  user: string;
  otherUser: string;
  similarity: number;
}[];

type MovieRecommendation = {
  movieId: number;
  weightedScore: number;
  similaritySum: number;
};

export class UserRecommend {
  processor = new CSVPrcessor();
  movieMapper = new MovieMapper();

  async getRecommendations(userId: string, nrOfResults: number) {
    // TODO calculate the similarity between the given userId and all the other users.
    const ratings = await getRatings();
    const map = this.buildRatingsMap(ratings);
    const similarities = await this.calculateSimilarities(userId, map);
    // This assumes that the array is already sorted in descending order
    const recommendations = this.calculateRecommendations(
      userId,
      map,
      similarities,
    ).slice(0, nrOfResults);
    const movies = await getMovies();
    return this.movieMapper.insertTitleToMovie(recommendations, movies);
  }

  // TODO make this more general and move it to a different class
  private calculateRecommendations(
    userId: string,
    map: RatingsMap,
    similarities: Similarities,
  ) {
    // Used to filter the movies the user has seen inside teh 2nd loop.
    const targetRatedMovies = new Set(
      map[userId].map((rating) => rating.raterId),
    );

    const movieScores: { [key: string]: MovieRecommendation } = {};

    for (const { otherUser, similarity } of similarities) {
      // Grab the ratings that we'll work on in this loop
      const otherUserRatings = map[otherUser];

      for (const { raterId, rating } of otherUserRatings) {
        if (targetRatedMovies.has(raterId)) continue;

        // Initialize the mapping on movieScore if it doesn't exist.
        if (!movieScores[raterId]) {
          movieScores[raterId] = {
            movieId: raterId,
            weightedScore: 0,
            similaritySum: 0,
          };
        }
        movieScores[raterId].weightedScore += similarity * rating;
        movieScores[raterId].similaritySum += similarity;
      }
    }

    const recommendations: IdScoreRecommend[] = Object.values(movieScores).map(
      (entry) => ({
        movieId: entry.movieId,
        score:
          entry.similaritySum > 0
            ? Number((entry.weightedScore / entry.similaritySum).toFixed(4))
            : 0,
      }),
    );

    recommendations.sort((a, b) => b.score - a.score);
    return recommendations;
  }

  private async calculateSimilarities(user: string, map: RatingsMap) {
    const similarities: Similarities = [];

    for (const otherUser in map) {
      if (otherUser === user) continue;

      const similarity = euclidieanSimilarity(user, otherUser, map);
      similarities.push({
        user: user,
        otherUser: otherUser,
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
