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
    getMovieById: (state) => (id: number) => {
      return state.movies.find((movie) => movie.id === id);
    },
    getNowShowingMovies: (state) => state.movies,
  },

  actions: {
    async fetchMovies() {
      this.loading = true;
      try {
        const movies = await movieApi.getAllMovies();
        this.movies = movies;
      } catch (error) {
        console.error("Error fetching movies:", error);
        this.error = "Failed to fetch movies";
      } finally {
        this.loading = false;
      }
    },

    async fetchMovieById(id: number) {
      try {
        return await movieApi.getMovieById(id);
      } catch (error) {
        console.error("Error fetching movie:", error);
        throw error;
      }
    },

    async searchMovies(query: string) {
      try {
        return await movieApi.searchMovies(query);
      } catch (error) {
        console.error("Error searching movies:", error);
        throw error;
      }
    },
  },
});
