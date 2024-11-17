type RatingEntry = { raterId: number; rating: number };

export type RatingsMap = {
  [entityId: string]: RatingEntry[];
};

type MovieRecommendation = {
  movieId: string;
  weightedScore: number;
  similaritySum: number;
};

export function euclidieanSimilarity(
  itemAId: string,
  itemBId: string,
  ratingsMap: RatingsMap,
) {
  const entityA = ratingsMap[itemAId];
  const entityB = ratingsMap[itemBId];
  let similarity = 0;
  let matching = 0;

  // Create a map which has faster lookups than using a double for loop as was presented in the lecture
  // That would have an O(N^2) complexity in the worst case.
  // This supposedly has O(N) time complexity but I didn't dig into why.
  const entityARatingsMap = new Map(
    entityA.map((entry) => [entry.raterId, entry.rating]),
  );

  for (const ratingB of entityB) {
    if (entityARatingsMap.has(ratingB.raterId)) {
      const ratingA = entityARatingsMap.get(ratingB.raterId)!;
      const diff = ratingA - ratingB.rating;
      similarity += diff ** 2;
      matching += 1;
    }
  }

  if (matching === 0) {
    return 0;
  }

  return (1 / (1 + similarity)).toFixed(4);
}

export function calculateRecommendations(
  userId: string,
  map: RatingsMap,
  similarities: Similarity[],
) {
  // Used to filter the movies the user has seen inside the 2nd loop.
  // TODO maybe move this out not sure how it should be used for movies
  const targetRatedMovies = new Set(
    map[userId].map((rating) => rating.raterId),
  );
  const movieScores: { [key: string]: MovieRecommendation } = {};

  for (const { itemB, similarity } of similarities) {
    // Grab the ratings that we'll work on in this loop
    const otherUserRatings = map[itemB];

    for (const { raterId, rating } of otherUserRatings) {
      if (targetRatedMovies.has(raterId)) continue;

      // Initialize the mapping on movieScore if it doesn't exist.
      if (!movieScores[raterId]) {
        movieScores[raterId] = {
          movieId: raterId.toString(),
          weightedScore: 0,
          similaritySum: 0,
        };
      }
      movieScores[raterId].weightedScore += similarity * rating;
      movieScores[raterId].similaritySum += similarity;
    }
  }

  const recommendations: IdScoreRecommend[] = Object.values(movieScores).map(
    (entry) => ({
      movieId: entry.movieId,
      score:
        entry.similaritySum > 0
          ? Number((entry.weightedScore / entry.similaritySum).toFixed(4))
          : 0,
    }),
  );

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations;
}

export function buildRatingsMapGeneric<T extends keyof UntransformedRatings>(
  ratings: UntransformedRatings[],
  groupByKey: T,
  raterKey: keyof UntransformedRatings,
  ratingKey: keyof UntransformedRatings,
) {
  const groupedRatings: RatingsMap = {};

  for (const rating of ratings) {
    const groupId = rating[groupByKey];
    if (!groupedRatings[groupId]) {
      groupedRatings[groupId] = [];
    }
    groupedRatings[groupId].push({
      raterId: Number(rating[raterKey]),
      rating: Number(rating[ratingKey]),
    });
  }

  return groupedRatings;
}
