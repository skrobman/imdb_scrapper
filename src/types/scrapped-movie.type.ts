import { ScrappedDirectorType } from './scrapped-director.type';
import { ScrappedPeoplesType } from './scrapped-peoples.type';

export type ScrappedMovieType = {
  rank: number;
  title: string;
  year: number;
  runtime: number;
  filmRatingSystem: string;
  imdbRating: number;
  url: string | null;
  directors: ScrappedDirectorType[];
  writers: ScrappedPeoplesType[];
  topCast: ScrappedPeoplesType[];
};