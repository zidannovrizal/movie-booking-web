import api from "./config";
import type {
  Movie,
  CreateMovieDto,
  UpdateMovieDto,
  ShowTime,
  Theater,
} from "@/types";

export const movieApi = {
  // Get all movies (now playing)
  getAllMovies: async () => {
    const response = await api.get<Movie[]>("/api/movies");
    return response.data;
  },

  // Get movie by id
  getMovieById: async (id: number) => {
    const response = await api.get<Movie>(`/api/movies/${id}`);
    return response.data;
  },

  // Get now showing movies
  getNowShowingMovies: async () => {
    const response = await api.get<Movie[]>("/api/movies/now-showing");
    return response.data;
  },

  // Get coming soon movies
  getComingSoonMovies: async () => {
    const response = await api.get<Movie[]>("/api/movies/coming-soon");
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string) => {
    const response = await api.get<Movie[]>(
      `/api/movies/search/${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Get movie theaters and their availability
  getMovieTheaters: async (movieId: number) => {
    const response = await api.get<{ theaters: Theater[]; count: number }>(
      `/api/movies/${movieId}/theaters`
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

  // Create booking
  createBooking: async (data: {
    theaterId: string;
    movieId: number;
    showDate: string;
    showTime: string;
    seats: string[];
    isVIP: boolean;
  }) => {
    const response = await api.post("/api/bookings", data);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async () => {
    const response = await api.get("/api/bookings");
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string) => {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  },
};
