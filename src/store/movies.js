import { defineStore } from "pinia";

export const useMovieStore = defineStore("movies", {
  state: () => ({
    movies: [],
    loading: false,
    error: null,
    selectedMovie: null,
  }),

  actions: {
    async fetchMovies() {
      this.loading = true;
      try {
        // TODO: Replace with actual API call when backend is ready
        this.movies = [
          {
            id: 1,
            title: "Inception",
            poster:
              "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            rating: 4.5,
            genre: "Sci-Fi",
            duration: "2h 28min",
            releaseDate: "2010-07-16",
            description:
              "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          },
          {
            id: 2,
            title: "The Dark Knight",
            poster:
              "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            rating: 4.8,
            genre: "Action",
            duration: "2h 32min",
            releaseDate: "2008-07-18",
            description:
              "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
          },
          {
            id: 3,
            title: "Interstellar",
            poster:
              "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            rating: 4.7,
            genre: "Sci-Fi",
            duration: "2h 49min",
            releaseDate: "2014-11-07",
            description:
              "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          },
          {
            id: 4,
            title: "Pulp Fiction",
            poster:
              "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            rating: 4.6,
            genre: "Crime",
            duration: "2h 34min",
            releaseDate: "1994-10-14",
            description:
              "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
          },
          {
            id: 5,
            title: "The Shawshank Redemption",
            poster:
              "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            rating: 4.9,
            genre: "Drama",
            duration: "2h 22min",
            releaseDate: "1994-09-23",
            description:
              "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          },
          {
            id: 6,
            title: "The Matrix",
            poster:
              "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            rating: 4.7,
            genre: "Sci-Fi",
            duration: "2h 16min",
            releaseDate: "1999-03-31",
            description:
              "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
          },
          {
            id: 7,
            title: "Goodfellas",
            poster:
              "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
            rating: 4.6,
            genre: "Crime",
            duration: "2h 25min",
            releaseDate: "1990-09-19",
            description:
              "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
          },
          {
            id: 8,
            title: "The Godfather",
            poster:
              "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            rating: 4.9,
            genre: "Crime",
            duration: "2h 55min",
            releaseDate: "1972-03-24",
            description:
              "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          },
        ];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    setSelectedMovie(movie) {
      this.selectedMovie = movie;
    },
  },

  getters: {
    getMovieById: (state) => (id) => {
      return state.movies.find((movie) => movie.id === id);
    },
    getFeaturedMovies: (state) => {
      return state.movies.slice(0, 4);
    },
  },
});
