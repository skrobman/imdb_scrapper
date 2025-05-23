import { ScrappedDirectorType } from './scrapped-director.type';
import { ScrappedPeoplesType } from './scrapped-peoples.type';
import { Financials } from '../scrapper/services/BudgetScrapeService/budget-scrape.service';

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
  financials: Financials;
};