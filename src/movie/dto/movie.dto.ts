export class MovieCacheDto {
  title: string;
  url: string;
  year: number;
  runtime: number;
  filmRatingSystem: string;
  imdbRating: number;
  directors: { director_name: string }[];
  writers: { full_name: string }[];
  topCast: { full_name: string }[];
  releaseDate: string; // ISO format
  releaseCountry: string;
  languages: string[];
  filmLocations: string;
  countriesOfOrigin: string[];
  productionCompanies: string[];
  financial?: {
    budget: number | null;
    grossUSCanada: number | null;
    openingWeekendUSCanada: number | null;
    grossWorldwide: number | null;
  };
}