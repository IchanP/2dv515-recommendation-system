import path from "node:path";
import { CSVPrcessor } from "./CSVProcessor";
import { euclidieanSimilarity, RatingsMap } from "@/util";
import { UntransformedRatings } from "./MovieTransposer";

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

const publicPath = path.join(process.cwd(), "public");
export class UserRecommend {
  processor = new CSVPrcessor();
  async getRecommendations(userId: string, nrOfResults: number) {
    // TODO calculate the similarity between the given userId and all the other users.
    const ratings = await this.processor.processCsvFile<UntransformedRatings>(
      publicPath + "/data/ratings.csv",
    );
    const map = this.buildRatingsMap(ratings);
    const similarities = await this.calculateSimilarities(userId, map);
    // This assumes that the array is already sorted in descending order
    const recommendations = this.calculateRecommendations(
      userId,
      map,
      similarities,
    ).slice(0, nrOfResults);
    // TODO map the movie id to a movie name and then return the result.
    return null;
  }

  private calculateRecommendations(
    userId: string,
    map: RatingsMap,
    similarities: { user: string; otherUser: string; similarity: number }[],
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

    const recommendations = Object.values(movieScores).map((entry) => ({
      movieId: entry.movieId,
      score:
        entry.similaritySum > 0
          ? Number((entry.weightedScore / entry.similaritySum).toFixed(4))
          : 0,
    }));

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
