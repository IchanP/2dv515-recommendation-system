import { parse } from "csv-parse";
import fs from "node:fs";
import { finished } from "stream/promises";
import path from "path";

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

type MovieRatingsMap = {
  [movieId: number]: { userId: number; rating: number }[];
};

/**
 * Transposes the dataset from the data located under /public/data into a
 */
export class CSVTransposer {
  movies: UntransformedMovieSet[] = [];
  userRatings: UntransformedRatings[] = [];
  users: UntransformedUsers[] = [];
  movieRatings: MovieRatingsMap = {};
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
    console.log(this.movieRatings);
  }

  private async transpose(ratings: UntransformedRatings[]) {
    for (const rating of ratings) {
      const movieId = rating.MovieId;
      if (!this.movieRatings[movieId]) {
        this.movieRatings[movieId] = [];
      }
      this.movieRatings[movieId].push({
        userId: rating.UserId,
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
}
