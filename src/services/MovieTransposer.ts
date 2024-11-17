import { RatingsMap } from "@/util";

/**
 * Transposes the dataset from the data located under /public/data into a
 */
export class MovieTransposer {
  userRatings: UntransformedRatings[] = [];
  async transpose(ratings: UntransformedRatings[]) {
    const movieRatings: RatingsMap = {};
    for (const rating of ratings) {
      const movieId = rating.MovieId;
      if (!movieRatings[movieId]) {
        movieRatings[movieId] = [];
      }
      movieRatings[movieId].push({
        raterId: rating.UserId,
        rating: rating.Rating,
      });
    }
    return movieRatings;
  }
}
