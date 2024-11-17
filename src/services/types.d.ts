// TODO move several types here to avoid interdependencies
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

declare type Similarities = {
  itemA: string;
  itemB: string;
  similarity: number;
};

type UntransformedRatings = {
  UserId: number;
  MovieId: number;
  Rating: number;
};
