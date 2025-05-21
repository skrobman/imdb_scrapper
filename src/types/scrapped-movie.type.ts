import { ScrappedDirectorType } from './scrapped-director.type';
import { ScrappedWritersType } from './scrapped-writers.type';
import { ScrappedTopCastType } from './scrapped-top-cast.type';

export type ScrappedMovieType = {
  rank: number;
  title: string;
  year: number;
  runtime: number;
  filmRatingSystem: string;
  imdbRating: number;
  url: string | null;
  directors: ScrappedDirectorType[];
  writers: ScrappedWritersType[];
  topCast: ScrappedTopCastType[];
};