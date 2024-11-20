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

export function pearsonSimilarity(
  itemAId: string,
  itemBId: string,
  ratingsMap: RatingsMap,
) {
  let sumOne = 0;
  let sumTwo = 0;
  let sumOneSq = 0;
  let sumTwoSq = 0;
  let pSum = 0;
  let matching = 0;

  const entityA = ratingsMap[itemAId];
  const entityB = ratingsMap[itemBId];
  const entityARatingsMap = new Map(
    entityA.map((entry) => [entry.raterId, entry.rating]),
  );

  for (const ratingB of entityB) {
    if (entityARatingsMap.has(ratingB.raterId)) {
      const ratingA = Number(entityARatingsMap.get(ratingB.raterId));
      sumOne += ratingA;
      sumTwo += ratingB.rating;
      sumOneSq += ratingA ** 2;
      sumTwoSq += ratingB.rating ** 2;
      pSum += ratingA * ratingB.rating;
      matching++;
    }
  }
  if (matching == 0) {
    return 0;
  }

  const num = pSum - (sumOne * sumTwo) / matching;
  const den = Math.sqrt(
    (sumOneSq - sumOne ** 2 / matching) * (sumTwoSq - sumTwo ** 2 / matching),
  );
  return num / den;
}
