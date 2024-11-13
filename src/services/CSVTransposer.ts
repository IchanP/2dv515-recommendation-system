import { parse } from "csv-parse";
import fs from "node:fs";
import { finished } from "stream/promises";
import path from "path";
import { RatingsMap, euclidieanSimilarity } from "@/util";

type UntransformedMovieSet = {
  MovieId: number;
  Title: string;
  Year: number;
};

type UntransformedRatings = {
  UserId: number;
  MovieId: number;
  Rating: number;
};

type UntransformedUsers = {
  UserId: number;
  Name: string;
};

/**
 * Transposes the dataset from the data located under /public/data into a
 */
export class CSVTransposer {
  movies: UntransformedMovieSet[] = [];
  userRatings: UntransformedRatings[] = [];
  users: UntransformedUsers[] = [];
  movieRatings: RatingsMap = {};
  /**
   * Transforms all the CSV files under the /public/data path
   * and outputs a similarity score CSV file for users.
   */
  async processFiles() {
    // Would have liked to make this more general but not enough time.
    const publicPath = path.join(process.cwd(), "public");

    this.movies = await this.processCsvFile<UntransformedMovieSet>(
      publicPath + "/data/movies.csv",
    );
    this.userRatings = await this.processCsvFile<UntransformedRatings>(
      publicPath + "/data/ratings.csv",
    );
    this.users = await this.processCsvFile<UntransformedUsers>(
      publicPath + "/data/users.csv",
    );
    this.transpose(this.userRatings);
    console.log(this.calculateAllMovieSimilarities(this.movieRatings));
  }

  private async transpose(ratings: UntransformedRatings[]) {
    for (const rating of ratings) {
      const movieId = rating.MovieId;
      if (!this.movieRatings[movieId]) {
        this.movieRatings[movieId] = [];
      }
      this.movieRatings[movieId].push({
        raterId: rating.UserId,
        rating: rating.Rating,
      });
    }
  }

  // TODO should maybe move this to another class for reusability
  private async processCsvFile<T>(filePath: string) {
    // TODO Need to add in an either clause here for the other CSV files
    const tempRecords: T[] = [];

    // Uses pipe to immediately pass the output of reading into the parser.
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        delimiter: ";",
        trim: true,
        skip_empty_lines: true,
      }),
    );

    let headers: string[] = [];
    parser.on("readable", () => {
      let record: string[];

      while ((record = parser.read()) !== null) {
        if (headers.length === 0) {
          headers = record;
        } else {
          const recordObject = this.mapRecordToType<T>(headers, record);
          tempRecords.push(recordObject as T);
        }
      }
    });

    await finished(parser);
    return tempRecords;
  }

  private mapRecordToType<T>(headers: string[], record: string[]): Partial<T> {
    const recordObject: Partial<T> = {};
    headers.forEach((header, index) => {
      // Dynamically assign properties based on headers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recordObject as any)[header] = record[index];
    });
    return recordObject;
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
