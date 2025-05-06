import { ref } from "vue";
import type { Movie } from "@/types";

export function useMovies() {
  const searchQuery = ref("");
  const selectedGenre = ref<string | null>(null);

  const filterMovies = (movies: Movie[]) => {
    if (!movies) return [];

    let filteredResults = [...movies];

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      filteredResults = filteredResults.filter((movie) => {
        return (
          movie.title?.toLowerCase().includes(query) ||
          movie.description?.toLowerCase().includes(query) ||
          movie.genres?.toLowerCase().includes(query)
        );
      });
    }

    // Filter by genre
    if (selectedGenre.value) {
      filteredResults = filteredResults.filter((movie) =>
        movie.genres?.includes(selectedGenre.value)
      );
    }

    return filteredResults;
  };

  const getUniqueGenres = (movies: Movie[]) => {
    if (!movies) return [];
    const genres = movies.reduce((acc: string[], movie) => {
      if (movie.genres) {
        const movieGenres = movie.genres.split(",").map((g) => g.trim());
        acc.push(...movieGenres);
      }
      return acc;
    }, []);
    return [...new Set(genres)].sort();
  };

  const formatReleaseDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    searchQuery,
    selectedGenre,
    filterMovies,
    getUniqueGenres,
    formatReleaseDate,
  };
}
