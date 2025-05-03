<template>
  <div class="home-page">
    <Navbar />

    <!-- Hero Section -->
    <section class="hero-section">
      <v-parallax
        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2250&q=80"
        height="600"
      >
        <div class="hero-overlay"></div>
        <v-container class="h-100">
          <v-row class="h-100" align="center">
            <v-col cols="12" md="8" lg="6">
              <h1 class="text-h2 font-weight-bold text-white mb-4">
                Experience the Magic of Cinema
              </h1>
              <p class="text-h6 text-white mb-6">
                Book your favorite movies and enjoy the best theatrical
                experience
              </p>
              <v-btn
                color="primary"
                size="x-large"
                rounded="pill"
                class="text-none px-8"
                @click="scrollToMovies"
              >
                Browse Movies
                <v-icon class="ml-2">mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </section>

    <v-container class="mt-15">
      <!-- Search and Filter Section -->
      <v-row class="mb-8">
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Search movies"
            variant="outlined"
            rounded="pill"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedGenre"
            :items="genres"
            label="Filter by genre"
            variant="outlined"
            rounded="pill"
            hide-details
          ></v-select>
        </v-col>
      </v-row>

      <!-- Featured Movies Section -->
      <section id="featured" class="mb-15">
        <div class="d-flex align-center justify-space-between mb-8">
          <h2 class="text-h4 font-weight-bold">Featured Movies</h2>
          <v-btn
            variant="text"
            color="primary"
            class="text-none"
            @click="showAllMovies"
          >
            View All
            <v-icon class="ml-1">mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="movie in featuredMovies"
            :key="movie.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCard :movie="movie" @book="handleBooking(movie)" />
          </v-col>
        </v-row>
      </section>

      <!-- Now Showing Section -->
      <section id="now-showing" class="mb-15">
        <h2 class="text-h4 font-weight-bold mb-8">Now Showing</h2>

        <div v-if="loading" class="d-flex justify-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
        </div>

        <v-row v-else>
          <v-col
            v-for="movie in filteredMovies"
            :key="movie.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <MovieCard :movie="movie" @book="handleBooking(movie)" />
          </v-col>
        </v-row>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section pa-8 rounded-lg mb-15">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h4 font-weight-bold mb-4">Stay Updated</h2>
            <p class="text-body-1 mb-8">
              Subscribe to our newsletter for the latest movie updates and
              exclusive offers
            </p>
            <v-row justify="center">
              <v-col cols="12" sm="8" md="6">
                <v-text-field
                  v-model="email"
                  label="Enter your email"
                  variant="outlined"
                  rounded="pill"
                  append-inner-icon="mdi-send"
                  hide-details
                  @click:append-inner="subscribeNewsletter"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </section>
    </v-container>

    <!-- Booking Dialog -->
    <v-dialog v-model="bookingDialog" max-width="500">
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 pa-4">
          Book Tickets
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="float-right"
            @click="bookingDialog = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <p class="text-body-1">
            Booking functionality will be implemented when the backend is ready.
          </p>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            rounded="pill"
            class="px-6"
            @click="bookingDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useMovieStore } from "@/store/movies";
import { useMovies } from "@/composables/useMovies";
import MovieCard from "@/components/MovieCard.vue";
import Navbar from "@/components/Navbar.vue";

const store = useMovieStore();
const { searchQuery, selectedGenre, filterMovies } = useMovies();

const bookingDialog = ref(false);
const selectedMovie = ref(null);
const email = ref("");

const movies = computed(() => store.movies);
const loading = computed(() => store.loading);
const featuredMovies = computed(() => store.getFeaturedMovies);

const filteredMovies = computed(() => {
  return filterMovies(movies.value);
});

const genres = computed(() => {
  const uniqueGenres = new Set(movies.value.map((movie) => movie.genre));
  return ["All", ...Array.from(uniqueGenres)];
});

const handleBooking = (movie) => {
  selectedMovie.value = movie;
  bookingDialog.value = true;
};

const scrollToMovies = () => {
  document.getElementById("featured")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const showAllMovies = () => {
  document.getElementById("now-showing")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const subscribeNewsletter = () => {
  // TODO: Implement newsletter subscription
  console.log("Subscribe:", email.value);
};

onMounted(async () => {
  await store.fetchMovies();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.hero-section {
  position: relative;
  margin-top: -64px; /* Adjust for navbar height */
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 1;
}

:deep(.v-parallax__content) {
  z-index: 2;
}

.newsletter-section {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.8) 100%
  );
  color: white;
}

.v-container {
  max-width: 1440px;
}
</style>
