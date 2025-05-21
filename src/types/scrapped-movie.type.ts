import { ScrappedDirectorType } from './scrapped-director.type';
import { ScrappedGenreType } from './scrapped-genre.type';

export type ScrappedMovieType = {
  rank: number;
  title: string;
  year: number;
  runtime: number;
  filmRatingSystem: string;
  imdbRating: number;
  url: string | null;
  directors: ScrappedDirectorType[];
  genres: ScrappedGenreType[];
};