import { ref, computed } from "vue";
import type { Movie } from "@/types";

export function useMovies() {
  const searchQuery = ref("");
  const selectedGenre = ref("All");

  const filterMovies = (movies: Movie[]) => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());

      const matchesGenre =
        selectedGenre.value === "All" || movie.genre === selectedGenre.value;

      return matchesSearch && matchesGenre;
    });
  };

  return {
    searchQuery,
    selectedGenre,
    filterMovies,
  };
}
