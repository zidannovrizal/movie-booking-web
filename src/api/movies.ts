import api from "./config";
import type { Movie, CreateMovieDto, UpdateMovieDto, ShowTime } from "@/types";

export const movieApi = {
  // Get all movies (now playing)
  getAllMovies: async () => {
    const response = await api.get<Movie[]>("/movies");
    return response.data;
  },

  // Get movie by id
  getMovieById: async (id: number) => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  // Get now showing movies
  getNowShowingMovies: async () => {
    const response = await api.get<Movie[]>("/movies/now-showing");
    return response.data;
  },

  // Get coming soon movies
  getComingSoonMovies: async () => {
    const response = await api.get<Movie[]>("/movies/coming-soon");
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string) => {
    const response = await api.get<Movie[]>(
      `/movies/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get movie showtimes
  getMovieShowtimes: async (movieId: number) => {
    const response = await api.get<ShowTime[]>(`/movies/${movieId}/showtimes`);
    return response.data;
  },

  // Create movie (admin only)
  createMovie: async (movie: CreateMovieDto) => {
    const response = await api.post<Movie>("/movies", movie);
    return response.data;
  },

  // Update movie (admin only)
  updateMovie: async (id: string, movie: UpdateMovieDto) => {
    const response = await api.put<Movie>(`/movies/${id}`, movie);
    return response.data;
  },

  // Delete movie (admin only)
  deleteMovie: async (id: string) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },

  // Sync now playing movies from TMDB (admin only)
  syncNowPlayingMovies: async () => {
    const response = await api.post("/movies/sync/now-playing");
    return response.data;
  },

  // Sync upcoming movies from TMDB (admin only)
  syncUpcomingMovies: async () => {
    const response = await api.post("/movies/sync/upcoming");
    return response.data;
  },
};
