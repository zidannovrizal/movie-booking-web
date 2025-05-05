import { defineStore } from "pinia";
import api from "@/api/config";

interface Theater {
  id: string;
  name: string;
  city: string;
  location: string;
  facilities: string[];
  capacity: number;
}

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  backdropPath: string;
  overview: string;
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  genres: string[];
}

interface Booking {
  id: string;
  seats: string[];
}

interface Showtime {
  id: string;
  startTime: string;
  price: number;
  theater: Theater;
  movie: Movie;
  bookings: Booking[];
}

interface ShowtimeState {
  showtimes: Showtime[];
  currentShowtime: Showtime | null;
  loading: boolean;
  error: string | null;
}

export const useShowtimeStore = defineStore("showtime", {
  state: (): ShowtimeState => ({
    showtimes: [],
    currentShowtime: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getShowtime(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get<Showtime>("/showtimes/" + id);
        this.currentShowtime = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to fetch showtime";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getShowtimes(movieId: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get<Showtime[]>(
          "/showtimes/movie/" + movieId
        );
        this.showtimes = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to fetch showtimes";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
