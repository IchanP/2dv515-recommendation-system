declare type IdScoreRecommend = {
  movieId: string;
  score: number;
};

declare type Recommendation = {
  movieId: number;
  score: number;
  title: string;
};

declare type Movie = {
  MovieId: string;
  Title: string;
  Year: number;
};

declare type Similarity = {
  itemA: string;
  itemB: string;
  similarity: number;
};

type UntransformedRatings = {
  UserId: string;
  MovieId: number;
  Rating: number;
};

type AcceptableUserRecommendTypes = "Pearson" | "Euclidean";

type RatingEntry = { raterId: number; rating: number };

type RatingsMap = {
  [entityId: string]: RatingEntry[];
};
