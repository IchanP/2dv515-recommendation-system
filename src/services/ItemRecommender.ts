import {
  buildRatingsMap,
  calculateMovieRecommendation,
  RatingsMap,
} from "@/util";
import { getMovies, getMovieSimilarities, getRatings } from "./CSVReader";
import { MovieMapper } from "./MovieMapper";

export class ItemRecommender {
  movieMapper = new MovieMapper();
  async getRecommendations(userId: number, nrOfResults: number) {
    const readSimilarities = await getMovieSimilarities();
    // Necessary op as similarity will be a string when we read it from a file
    const movieSimiliarities = this.convertSimilarityToNumber(readSimilarities);

    const userRatings = await getRatings();
    const ourUserRatings = userRatings.filter(
      (rating) => Number(rating.UserId) === userId,
    );

    const map = buildRatingsMap(ourUserRatings, "MovieId", "UserId", "Rating");
    // Filter out the unseen movies from the comparison as they're uninteresting.
    const filtered = this.filterSimilarities(map, movieSimiliarities);
    const recommendations = calculateMovieRecommendation(map, filtered).slice(
      0,
      nrOfResults,
    );

    const movies = await getMovies();
    return this.movieMapper.insertTitleToMovie(recommendations, movies);
  }

  private filterSimilarities(map: RatingsMap, similarities: Similarity[]) {
    const keySet = new Set(Object.keys(map)); // Gives acces to has function
    return similarities.filter((sim) => {
      // Include if exactly one of the movies is rated
      const aIsRated = keySet.has(sim.itemA);
      const bIsRated = keySet.has(sim.itemB);
      return (aIsRated && !bIsRated) || (!aIsRated && bIsRated);
    });
  }

  private convertSimilarityToNumber(similarities: Similarity[]) {
    return similarities.map((e) => {
      return {
        itemA: e.itemA,
        itemB: e.itemB,
        similarity: Number(e.similarity),
      };
    });
  }
}
