import { parse } from "csv-parse";
import fs from "node:fs";
import { finished } from "stream/promises";

export class CSVPrcessor {
  async processCsvFile<T>(filePath: string) {
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
