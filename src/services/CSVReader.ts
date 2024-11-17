import { User } from "@/components/Recommender";
import { CSVPrcessor } from "./CSVProcessor";
import path from "node:path";

const reader = new CSVPrcessor();
const publicPath = path.join(process.cwd(), "public");

export async function getUsers(): Promise<User[]> {
  return reader.processCsvFile<User>(`${publicPath}/data/users.csv`);
}

export async function getMovies(): Promise<Movie[]> {
  return reader.processCsvFile<Movie>(`${publicPath}/data/movies.csv`);
}

export async function getRatings(): Promise<UntransformedRatings[]> {
  return reader.processCsvFile<UntransformedRatings>(
    `${publicPath}/data/ratings.csv`,
  );
}
export async function getMovieSimilarities() {
  return reader.processCsvFile<Similarity>(
    `${publicPath}/data/transposed/movie-similarities.csv`,
  );
}
