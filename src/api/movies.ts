import api from "./config";
import type { Movie, CreateMovieDto, UpdateMovieDto } from "@/types";

export const movieApi = {
  // Get all movies
  getAllMovies: () => api.get<Movie[]>("/movies"),

  // Get movie by id
  getMovieById: (id: string) => api.get<Movie>(`/movies/${id}`),

  // Get now showing movies
  getNowShowingMovies: () => api.get<Movie[]>("/movies/now-showing"),

  // Get coming soon movies
  getComingSoonMovies: () => api.get<Movie[]>("/movies/coming-soon"),

  // Create movie (admin only)
  createMovie: (movie: CreateMovieDto) => api.post<Movie>("/movies", movie),

  // Update movie (admin only)
  updateMovie: (id: string, movie: UpdateMovieDto) =>
    api.put<Movie>(`/movies/${id}`, movie),

  // Delete movie (admin only)
  deleteMovie: (id: string) => api.delete(`/movies/${id}`),
};
