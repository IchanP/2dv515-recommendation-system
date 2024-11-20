import path from "node:path";
import { CSVPrcessor } from "./CSVProcessor";
import { buildRatingsMap } from "@/util";
import { euclidieanSimilarity } from "@/util/SimilarityCalculators";
import { CSVWRiter } from "./CSVWriter";
import { getRatings } from "./CSVReader";

export class PregenFacade {
  processor: CSVPrcessor;
  CSVWriter: CSVWRiter;
  constructor() {
    this.processor = new CSVPrcessor();
    this.CSVWriter = new CSVWRiter();
  }

  async generateTable() {
    // Would have liked to make this more general but not enough time.
    const publicPath = path.join(process.cwd(), "public");

    const userRatings = await getRatings();
    const transposedRatings = buildRatingsMap(
      userRatings,
      "MovieId",
      "UserId",
      "Rating",
    );
    const similarities = this.calculateAllMovieSimilarities(transposedRatings);
    this.CSVWriter.writeCSV(
      similarities,
      publicPath + "/data/transposed/movie-similarities.csv",
      ";",
    );
  }

  private calculateAllMovieSimilarities(movieRatings: RatingsMap) {
    const movieIds = Object.keys(movieRatings);
    // Turn it into an array of objects for easier handling
    const similarities: Similarity[] = [];

    // Quadratic growth since we loop over all the pairings.
    for (let i = 0; i < movieIds.length; i++) {
      for (let j = i + 1; j < movieIds.length; j++) {
        const movieAId = movieIds[i];
        const movieBId = movieIds[j];
        const similarityScore = euclidieanSimilarity(
          movieAId,
          movieBId,
          movieRatings,
        );
        similarities.push({
          itemA: movieAId,
          itemB: movieBId,
          similarity: Number(similarityScore),
        });
      }
    }

    return similarities.filter((element) => {
      return element.similarity !== 0;
    });
  }
}
