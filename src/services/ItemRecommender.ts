import { getMovieSimilarities } from "./CSVReader";

export class ItemRecommender {
  async getRecommendations(userId: string, nrOfResults: number) {
    const movieSimilarities = await getMovieSimilarities();
    console.log(movieSimilarities);
  }
}
