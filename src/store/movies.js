import { defineStore } from "pinia";
import { movieApi } from "@/api/movies";

export const useMovieStore = defineStore("movies", {
  state: () => ({
    movies: [],
    loading: false,
    error: null,
    selectedMovie: null,
  }),

  getters: {
    getFeaturedMovies: (state) => state.movies.slice(0, 4),
    getMovieById: (state) => (id) => {
      return state.movies.find((movie) => movie.id === id);
    },
    getNowShowingMovies: (state) => {
      return state.movies.filter((movie) => movie.status === "NOW_SHOWING");
    },
    getComingSoonMovies: (state) => {
      return state.movies.filter((movie) => movie.status === "COMING_SOON");
    },
  },

  actions: {
    async fetchMovies() {
      this.loading = true;
      try {
        const response = await movieApi.getAllMovies();
        console.log("Fetched movies:", response);
        this.movies = response;
      } catch (error) {
        console.error("Error fetching movies:", error.response || error);
        this.error = "Failed to fetch movies";
      } finally {
        this.loading = false;
      }
    },

    async syncNowPlayingMovies() {
      this.loading = true;
      try {
        console.log("Syncing now playing movies...");
        const response = await movieApi.syncNowPlayingMovies();
        console.log("Sync response:", response);
        await this.fetchMovies();
      } catch (error) {
        console.error(
          "Error syncing now playing movies:",
          error.response || error
        );
        this.error = "Failed to sync now playing movies";
      } finally {
        this.loading = false;
      }
    },

    async syncUpcomingMovies() {
      this.loading = true;
      try {
        console.log("Syncing upcoming movies...");
        const response = await movieApi.syncUpcomingMovies();
        console.log("Sync response:", response);
        await this.fetchMovies();
      } catch (error) {
        console.error(
          "Error syncing upcoming movies:",
          error.response || error
        );
        this.error = "Failed to sync upcoming movies";
      } finally {
        this.loading = false;
      }
    },

    setSelectedMovie(movie) {
      this.selectedMovie = movie;
    },
  },
});
