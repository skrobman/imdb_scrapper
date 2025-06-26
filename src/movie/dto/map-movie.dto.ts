import { Prisma } from '@prisma/client';
import { MovieCacheDto } from './movie.dto';

export function mapMovieCacheDtoToPrismaData(dto: MovieCacheDto): Prisma.MovieCreateInput {

  return {
    title: dto.title,
    url: dto.url,
    year: dto.year,
    runtime: dto.runtime,
    ratingSystem: dto.filmRatingSystem,
    imdbRating: dto.imdbRating,
    releaseDate: new Date(dto.releaseDate),
    releaseCountry: dto.releaseCountry,
    languages: {
      create: dto.languages.map(lang => ({
        language: {
          connectOrCreate: {
            where: { name: lang },
            create: { name: lang }
          }
        }
      }))
    },
    filmLocation: dto.filmLocations,
    countries: {
      create: dto.countriesOfOrigin.map(country => ({
        country: {
          connectOrCreate: {
            where: { name: country },
            create: { name: country }
          }
        }
      }))
    },
    companies: {
      create: dto.productionCompanies.map(company => ({
        company: {
          connectOrCreate: {
            where: { name: company },
            create: { name: company }
          }
        }
      }))
    },
    financial: dto.financial
      ? {
        create: {
          budget: dto.financial.budget ?? null,
          grossUsCanada: dto.financial.grossUSCanada ?? null,
          openingWeekendUsCanada: dto.financial.openingWeekendUSCanada ?? null,
          grossWorldwide: dto.financial.grossWorldwide ?? null,
        },
      }
      : undefined,
    actors: {
      create: dto.topCast.map(actor => ({
        actor: {
          connectOrCreate: {
            where: { fullName: actor.full_name },
            create: { fullName: actor.full_name }
          }
        }
      }))
    },
    directors: {
      create: dto.directors.map(dir => ({
        director: {
          connectOrCreate: {
            where: { fullName: dir.director_name },
            create: { fullName: dir.director_name }
          }
        }
      }))
    },
    writers: {
      create: dto.writers.map(writer => ({
        writer: {
          connectOrCreate: {
            where: { fullName: writer.full_name },
            create: { fullName: writer.full_name }
          }
        }
      }))
    },
  };
}