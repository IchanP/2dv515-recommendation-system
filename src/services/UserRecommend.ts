import path from "node:path";
import { CSVPrcessor } from "./CSVProcessor";
import { euclidieanSimilarity, RatingsMap } from "@/util";
import { UntransformedRatings } from "./MovieTransposer";
const publicPath = path.join(process.cwd(), "public");
export class UserRecommend {
  processor = new CSVPrcessor();
  async getRecommendations(userId: string, nrOfResults: string) {
    // TODO calculate the similarity between the given userId and all the other users.
    const ratings = await this.processor.processCsvFile<UntransformedRatings>(
      publicPath + "/data/ratings.csv",
    );
    const map = this.buildRatingsMap(ratings);
    const similarities = await this.calculateSimilarities(userId, map);
    console.log(similarities);
    return null;
  }

  private async calculateSimilarities(user: string, map: RatingsMap) {
    const similarities: {
      user: string;
      otherUser: string;
      similarity: number;
    }[] = [];

    for (const otherUser in map) {
      if (otherUser === user) continue;

      const similarity = euclidieanSimilarity(user, otherUser, map);
      similarities.push({
        user: user,
        otherUser: otherUser,
        similarity: Number(similarity),
      });
    }

    return similarities;
  }

  // This is the exact same as in MovieTransposer
  // but I didn't have time to spend to generalize it for both use cases.
  private buildRatingsMap(ratings: UntransformedRatings[]) {
    const userRatings: RatingsMap = {};
    for (const rating of ratings) {
      const userId = rating.UserId;
      if (!userRatings[userId]) {
        userRatings[userId] = [];
      }
      userRatings[userId].push({
        raterId: rating.MovieId,
        rating: rating.Rating,
      });
    }
    return userRatings;
  }
}
