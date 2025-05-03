import { ref } from "vue";
import { useMovieStore } from "@/store/movies";

export function useMovies() {
  const store = useMovieStore();
  const searchQuery = ref("");
  const selectedGenre = ref(null);

  const filterMovies = (movies) => {
    if (!movies) return [];

    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
      const matchesGenre =
        !selectedGenre.value || movie.genre === selectedGenre.value;
      return matchesSearch && matchesGenre;
    });
  };

  const getUniqueGenres = (movies) => {
    if (!movies) return [];
    return [...new Set(movies.map((movie) => movie.genre))];
  };

  const formatReleaseDate = (dateString) => {
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
    // Expose store actions and state
    fetchMovies: store.fetchMovies,
    setSelectedMovie: store.setSelectedMovie,
    movies: store.movies,
    loading: store.loading,
    error: store.error,
  };
}
