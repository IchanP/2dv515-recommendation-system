import path from "node:path";
import { CSVPrcessor } from "./CSVProcessor";
import { MovieTransposer, UntransformedRatings } from "./MovieTransposer";
import { euclidieanSimilarity, RatingsMap } from "@/util";
import { CSVWRiter } from "./CSVWriter";
import { getRatings } from "./CSVReader";

export class PregenFacade {
  processor: CSVPrcessor;
  transposer: MovieTransposer;
  CSVWriter: CSVWRiter;
  // TODO - To generalize this a bit we could pass the transposer and writer as arguments and accept interfaces rather than creating them here.
  constructor() {
    this.processor = new CSVPrcessor();
    this.transposer = new MovieTransposer();
    this.CSVWriter = new CSVWRiter();
  }

  async generateTable() {
    // Would have liked to make this more general but not enough time.
    const publicPath = path.join(process.cwd(), "public");

    const userRatings = await getRatings();
    const transposedRatings = await this.transposer.transpose(userRatings);
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
    const similarities: {
      movieA: string;
      movieB: string;
      similarity: string | number;
    }[] = [];

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
          movieA: movieAId,
          movieB: movieBId,
          similarity: similarityScore,
        });
      }
    }

    return similarities.filter((element) => {
      return element.similarity !== 0;
    });
  }
}
