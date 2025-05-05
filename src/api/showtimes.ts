import api from "./config";

export interface ShowTime {
  id: string;
  tmdbMovieId: number;
  theaterId: string;
  startTime: string;
  price: number;
  theater: {
    id: string;
    name: string;
    location: string;
  };
}

export const showtimeApi = {
  // Get showtimes for a movie
  getShowtimesByMovie: (movieId: number) =>
    api.get<ShowTime[]>(`/showtimes/movie/${movieId}`),

  // Get showtime by id
  getShowtimeById: (id: string) => api.get<ShowTime>(`/showtimes/${id}`),

  // Get available seats for a showtime
  getAvailableSeats: (id: string) =>
    api.get<{ bookedSeats: string[] }>(`/showtimes/${id}/seats`),

  // Create showtime (admin only)
  createShowtime: (data: {
    tmdbMovieId: number;
    theaterId: string;
    startTime: string;
    price: number;
  }) => api.post<ShowTime>("/showtimes", data),
};
