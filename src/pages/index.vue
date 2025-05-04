<template>
  <div class="home-page">
    <Navbar />

    <!-- Hero Section -->
    <section class="hero-section">
      <v-container class="h-100">
        <v-row class="h-100" align="center">
          <v-col cols="12" md="6" lg="5">
            <div class="hero-content">
              <h1 class="text-h2 font-weight-bold mb-6">
                Experience Movies Like Never Before
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-8">
                Book your tickets for the latest movies in premium theaters.
                Immerse yourself in stunning visuals and crystal-clear sound.
              </p>
              <div class="d-flex flex-wrap">
                <v-btn
                  color="primary"
                  size="large"
                  rounded="pill"
                  class="text-none px-8 mr-4 mb-4"
                  elevation="2"
                  @click="scrollToMovies"
                >
                  Browse Movies
                  <v-icon class="ml-2">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
            lg="7"
            class="d-none d-md-flex justify-center"
          >
            <v-img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              max-width="600"
              class="hero-image rounded-xl"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <v-container>
        <v-card
          class="search-card mx-auto"
          :elevation="theme.global.current.value.dark ? 0 : 3"
          :class="theme.global.current.value.dark ? 'bg-surface' : 'bg-white'"
          rounded="lg"
        >
          <v-row class="pa-4" align="center">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search movies..."
                variant="outlined"
                density="comfortable"
                hide-details
                class="search-input"
                @keyup.enter="searchMovies"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                color="primary"
                block
                size="large"
                elevation="0"
                @click="searchMovies"
              >
                Search
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </section>

    <v-container class="main-content py-12">
      <!-- Now Showing Section -->
      <section id="now-showing" class="mb-15">
        <div class="d-flex align-center justify-space-between mb-8">
          <div>
            <h2 class="text-h4 font-weight-bold mb-2">Now Showing</h2>
            <p class="text-body-1 text-medium-emphasis">
              Book your tickets now
            </p>
          </div>
        </div>

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
            <MovieCard :movie="movie" />
          </v-col>
        </v-row>
      </section>

      <!-- Promotion Section -->
      <section class="promotion-section rounded-xl mb-15 overflow-hidden">
        <v-row no-gutters>
          <v-col cols="12" md="6" class="pa-12">
            <h2 class="text-h3 font-weight-bold mb-4">Get Special Offers</h2>
            <p class="text-h6 mb-8 text-medium-emphasis">
              Subscribe to our newsletter and get exclusive movie deals,
              updates, and more!
            </p>
            <div class="d-flex flex-wrap">
              <v-text-field
                v-model="email"
                placeholder="Enter your email"
                variant="outlined"
                density="comfortable"
                hide-details
                class="flex-grow-1 mr-4 mb-4"
                style="max-width: 300px"
              ></v-text-field>
              <v-btn
                color="primary"
                size="large"
                elevation="0"
                @click="subscribeNewsletter"
                class="mb-4"
              >
                Subscribe
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="position-relative">
            <v-img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              height="100%"
              cover
            ></v-img>
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import { useMovieStore } from "@/store/movies";
import { useAuthStore } from "@/store/auth";
import { useMovies } from "@/composables/useMovies";
import MovieCard from "@/components/MovieCard.vue";
import Navbar from "@/components/Navbar.vue";

const theme = useTheme();
const movieStore = useMovieStore();
const authStore = useAuthStore();
const { searchQuery, filterMovies } = useMovies();

const email = ref("");

const loading = computed(() => movieStore.loading);
const filteredMovies = computed(() => {
  return filterMovies(movieStore.movies);
});
const error = computed(() => movieStore.error);

const scrollToMovies = () => {
  document.getElementById("now-showing")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const searchMovies = async () => {
  await movieStore.searchMovies(searchQuery.value);
};

const subscribeNewsletter = () => {
  // TODO: Implement newsletter subscription
  console.log("Subscribe:", email.value);
};

onMounted(async () => {
  try {
    if (authStore.user?.role === "ADMIN") {
      await movieStore.syncNowPlayingMovies();
    } else {
      await movieStore.fetchMovies();
    }
  } catch (error) {
    console.error("Error initializing movies:", error);
  }

  if (authStore.token) {
    await authStore.fetchCurrentUser();
  }
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  min-height: calc(100vh - 70px);
  padding: 40px 0;
  display: flex;
  align-items: center;
}

.hero-image {
  transform: perspective(1000px) rotateY(-15deg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.search-section {
  margin-bottom: 40px;
}

.search-card {
  max-width: 1000px;
}

.promotion-section {
  /* background color is handled by computed style */
}

.main-content {
  max-width: 1440px;
}

@media (max-width: 959px) {
  .hero-section {
    min-height: auto;
    padding: 60px 0;
  }
}
</style>
