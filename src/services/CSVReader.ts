import { User } from "@/components/Recommender";
import { CSVPrcessor } from "./CSVProcessor";
import path from "node:path";

const reader = new CSVPrcessor();
const publicPath = path.join(process.cwd(), "public");

export async function getUsers(): Promise<User[]> {
  return reader.processCsvFile<User>(`${publicPath}/data/users.csv`);
}
