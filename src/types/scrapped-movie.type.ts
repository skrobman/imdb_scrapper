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
  releaseDate: string | null;
  releaseCountry: string | null;
  languages: string[];
  filmLocations: string | null;
  countriesOfOrigin: string[];
  productionCompanies: string[];
  budget: number | null,
  grossUSCanada: number | null,
  openingWeekendUSCanada: number | null,
  grossWorldwide: number | null
};