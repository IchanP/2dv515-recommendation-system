type RatingEntry = { raterId: number; rating: number };

export type RatingsMap = {
  [entityId: string]: RatingEntry[];
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
