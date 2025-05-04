import { defineStore } from "pinia";
import { movieApi } from "@/api/movies";
import type { Movie } from "@/types";

export const useMovieStore = defineStore("movies", {
  state: () => ({
    movies: [] as Movie[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getFeaturedMovies: (state) => state.movies.slice(0, 4),
  },

  actions: {
    async fetchMovies() {
      this.loading = true;
      try {
        const response = await movieApi.getAllMovies();
        this.movies = response.data;
      } catch (error) {
        this.error = "Failed to fetch movies";
        console.error("Error fetching movies:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchNowShowingMovies() {
      this.loading = true;
      try {
        const response = await movieApi.getNowShowingMovies();
        this.movies = response.data;
      } catch (error) {
        this.error = "Failed to fetch now showing movies";
        console.error("Error fetching now showing movies:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchComingSoonMovies() {
      this.loading = true;
      try {
        const response = await movieApi.getComingSoonMovies();
        this.movies = response.data;
      } catch (error) {
        this.error = "Failed to fetch coming soon movies";
        console.error("Error fetching coming soon movies:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
