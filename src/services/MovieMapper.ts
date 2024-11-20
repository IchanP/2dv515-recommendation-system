export class MovieMapper {
  /**
   * Inserts the title of the movie to all recommendations passed.
   */
  insertTitleToMovie(
    unfinishedRecArray: IdScoreRecommend[],
    movies: Movie[],
  ): Recommendation[] {
    movies.sort((a, b) => Number(a.MovieId) - Number(b.MovieId));
    const recommendations: Recommendation[] = [];
    for (const rec of unfinishedRecArray) {
      const title = this.binarySearch(movies, rec.movieId);
      recommendations.push({
        movieId: Number(rec.movieId),
        title: title,
        score: rec.score,
      });
    }
    return recommendations.filter((rec) => {
      return rec.title !== ""; // Only return movies where we have found the title.
    });
  }

  private binarySearch(movieArray: Movie[], idToFind: string): string {
    let left = 0;
    let right = movieArray.length - 1;

    // Had to convert both idToFind and the other to numbers because string comparisons didn't work for some reason.
    const numberId = Number(idToFind);
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);

      // Convert MovieId to number for comparison
      const middleId = Number(movieArray[middle].MovieId);

      if (middleId === numberId) {
        return movieArray[middle].Title;
      } else if (middleId < numberId) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }
    return "";
  }
}
