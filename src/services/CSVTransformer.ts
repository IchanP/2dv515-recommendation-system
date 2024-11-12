import { parse } from "csv-parse";
import fs from "node:fs";
import { finished } from "stream/promises";
import path from "path";

type UntransformedMovieSet = {
  MovieId: number;
  Title: string;
  Year: number;
};

/**
 * Used to transform the dataset into a more manageable set and saving it to a CSV file.
 * Reduces computational time when doing later recommendations.
 */
export class CSVTransformer {
  movies: UntransformedMovieSet[] = [];

  /**
   * Transforms all the CSV files under the /public/data path
   * and outputs a similarity score CSV file for users.
   */
  async processFiles() {
    const publicPath = path.join(process.cwd(), "public");
    this.movies = await this.processCsvFile(publicPath + "/data/movies.csv");
    console.log(this.movies);
  }

  private async processCsvFile(filePath: string) {
    // TODO Need to add in an either clause here for the other CSV files
    const tempRecords: UntransformedMovieSet[] = [];

    // Uses pipe to immediately pass the output of reading into the parser.
    const parser = fs.createReadStream(filePath).pipe(
      parse({
        delimiter: ";",
        trim: true,
        skip_empty_lines: true,
      }),
    );

    parser.on("readable", function () {
      let record: UntransformedMovieSet;
      while ((record = parser.read()) !== null) {
        // Work with the record here
        // NOTE - The CSV files have columns at the top. Maybe I can grab those to generate the object?
        tempRecords.push(record);
      }
    });

    await finished(parser);
    return tempRecords;
  }

  // TODO for each user compare it with the other users and their movies
  // Store the similarity score in a table pair wise
  // On the next user start from the index infront of itself to avoid double computation.
}
