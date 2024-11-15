import fs from "node:fs";
type CSVRow = { [key: string]: unknown };
export class CSVWRiter {
  writeCSV(data: CSVRow[], filePath: string, delimiter: string) {
    const headers = Object.keys(data[0]);
    const headerLine = headers.join(delimiter);

    const rows = data.map((element) => {
      let finalString = "";
      let i = 1;
      for (const value of Object.values(element)) {
        finalString += value;
        if (i % 3 !== 0) {
          finalString += delimiter;
        }
        i++;
      }
      return finalString;
    });

    const csvContent = [headerLine, ...rows].join("\n");
    fs.writeFileSync(filePath, csvContent, "utf8");
  }
}
