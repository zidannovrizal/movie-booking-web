<template>
  <div class="movie-details" v-scroll="onScroll">
    <!-- Skeleton Loading -->
    <template v-if="loading">
      <div class="hero-section skeleton-hero">
        <v-container class="fill-height">
          <v-row align="center">
            <v-col cols="12" sm="3" md="3">
              <v-skeleton-loader
                class="poster-image"
                type="image"
                height="400"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="12" sm="9" md="9">
              <div class="movie-header">
                <v-skeleton-loader
                  type="article, actions"
                  class="movie-skeleton"
                ></v-skeleton-loader>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <div class="booking-section py-6">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card class="booking-card slide-up-animation">
                <v-card-text>
                  <v-skeleton-loader
                    type="article, list-item-three-line, actions"
                    class="booking-skeleton"
                  ></v-skeleton-loader>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>

    <template v-else-if="movie">
      <!-- Hero Section with Backdrop -->
      <div
        class="hero-section"
        :style="{
          transform: `translateY(${scrollPosition * 0.5}px)`,
          opacity: 1 - scrollPosition * 0.002,
        }"
      >
        <v-img
          :src="movie.backdropUrl"
          class="backdrop"
          height="400"
          cover
          :gradient="backdropGradient"
        >
          <v-container class="fill-height">
            <v-row align="center">
              <v-col cols="12" sm="3" md="3">
                <v-img
                  :src="movie.posterUrl || '/images/no-poster.png'"
                  :aspect-ratio="2 / 3"
                  cover
                  class="poster-image"
                  :style="{
                    transform: `translateY(${scrollPosition * 0.2}px)`,
                  }"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="9" md="9">
                <div class="movie-header">
                  <h1
                    class="text-h3 font-weight-bold text-white mb-2 animate-fade-in"
                  >
                    {{ movie.title }}
                  </h1>
                  <div
                    class="d-flex align-center flex-wrap mb-4 animate-fade-in"
                  >
                    <v-chip
                      v-for="genre in movie.genres?.split(',')"
                      :key="genre"
                      color="primary"
                      variant="flat"
                      size="small"
                      class="mr-2 mb-2"
                    >
                      {{ genre.trim() }}
                    </v-chip>
                  </div>
                  <div class="d-flex align-center flex-wrap text-white">
                    <div class="mr-4 mb-2">
                      <v-icon color="white" size="small" class="mr-1"
                        >mdi-clock-outline</v-icon
                      >
                      <span class="text-body-2">{{
                        formatDuration(movie.runtime)
                      }}</span>
                    </div>
                    <div class="mr-4 mb-2">
                      <v-icon color="white" size="small" class="mr-1"
                        >mdi-calendar</v-icon
                      >
                      <span class="text-body-2">{{
                        formatDate(movie.releaseDate)
                      }}</span>
                    </div>
                    <div class="mb-2">
                      <div class="d-flex align-center">
                        <v-rating
                          :model-value="movie.rating / 2"
                          color="amber"
                          half-increments
                          readonly
                          size="x-small"
                        ></v-rating>
                        <span class="ml-1 text-body-2"
                          >{{ movie.rating }}/10</span
                        >
                      </div>
                    </div>
                  </div>
                  <p
                    class="text-body-2 text-white-darken-2 mt-4 movie-description animate-fade-in"
                  >
                    {{ movie.description }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-img>
      </div>

      <!-- Booking Section -->
      <div class="booking-section py-6">
        <v-container>
          <v-row>
            <v-col cols="12">
              <!-- Login Required Overlay -->
              <v-overlay
                v-if="!isLoggedIn"
                contained
                class="align-center justify-center"
                scrim="black"
                :model-value="!isLoggedIn"
              >
                <v-card class="text-center pa-6 login-card" max-width="400">
                  <v-icon size="64" color="primary" class="mb-4"
                    >mdi-account-lock</v-icon
                  >
                  <h3 class="text-h5 mb-4">Login Required</h3>
                  <p class="mb-6">
                    Please login to book tickets for this movie
                  </p>
                  <v-btn color="primary" size="large" @click="navigateToLogin">
                    Login Now
                  </v-btn>
                </v-card>
              </v-overlay>

              <v-card
                class="booking-card"
                :class="{
                  'slide-up-animation': true,
                  'blur-background': !isLoggedIn,
                }"
              >
                <v-card-text class="pa-6">
                  <h2 class="text-h5 font-weight-bold mb-6">Book Tickets</h2>

                  <!-- Theater Selection -->
                  <div class="theater-selection mb-8">
                    <label
                      class="text-subtitle-1 font-weight-medium mb-3 d-block"
                      >Select Theater</label
                    >
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-model="selectedTheater"
                          :items="theaters"
                          item-title="name"
                          item-value="id"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                          class="theater-select"
                        >
                          <template v-slot:selection="{ item }">
                            <div class="d-flex align-center py-1">
                              <v-icon color="primary" class="mr-2"
                                >mdi-theater</v-icon
                              >
                              <div>
                                <div class="text-body-1">
                                  {{ item.raw.name }}
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                  {{ item.raw.location }}
                                </div>
                              </div>
                            </div>
                          </template>
                          <template v-slot:item="{ item, props }">
                            <v-list-item
                              v-bind="props"
                              :subtitle="item.raw.location"
                              :prepend-icon="'mdi-theater'"
                            ></v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Date Selection -->
                  <div class="date-selection mb-8">
                    <label
                      class="text-subtitle-1 font-weight-medium mb-3 d-block"
                      >Select Date</label
                    >
                    <v-sheet class="date-scroll" rounded>
                      <div class="d-flex date-container pa-2">
                        <v-hover
                          v-for="date in availableDates"
                          :key="date.value"
                          v-slot="{ isHovering, props }"
                        >
                          <v-card
                            v-bind="props"
                            :color="
                              selectedDate === date.value
                                ? 'primary'
                                : undefined
                            "
                            :class="{
                              'date-card': true,
                              'mr-2': true,
                              'elevation-3':
                                isHovering || selectedDate === date.value,
                              selected: selectedDate === date.value,
                            }"
                            @click="handleDateSelect(date)"
                          >
                            <v-card-text class="pa-3">
                              <div class="d-flex flex-column align-center">
                                <span class="text-caption mb-1">{{
                                  date.day
                                }}</span>
                                <span class="text-h5 font-weight-bold mb-1">{{
                                  date.date
                                }}</span>
                                <span class="text-caption">{{
                                  date.month
                                }}</span>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </div>
                    </v-sheet>
                  </div>

                  <!-- Time Selection -->
                  <div class="time-selection mb-8">
                    <label
                      class="text-subtitle-1 font-weight-medium mb-3 d-block"
                      >Select Time</label
                    >
                    <v-sheet rounded class="time-scroll">
                      <div class="d-flex flex-wrap time-container pa-2 gap-2">
                        <v-hover
                          v-for="time in availableTimes"
                          :key="time.value"
                          v-slot="{ isHovering, props }"
                        >
                          <v-card
                            v-bind="props"
                            :color="
                              selectedTime === time.value
                                ? 'primary'
                                : undefined
                            "
                            :class="{
                              'time-card': true,
                              'elevation-3':
                                isHovering && !time.isPast && time.isAvailable,
                              selected: selectedTime === time.value,
                              disabled: time.isPast || !time.isAvailable,
                            }"
                            @click="
                              !time.isPast && time.isAvailable
                                ? (selectedTime = time.value)
                                : null
                            "
                          >
                            <v-card-text class="pa-3">
                              <div class="d-flex align-center justify-center">
                                <v-icon
                                  :color="
                                    selectedTime === time.value
                                      ? 'white'
                                      : 'primary'
                                  "
                                  size="small"
                                  class="mr-2"
                                >
                                  {{
                                    time.isPast
                                      ? "mdi-clock-alert"
                                      : "mdi-clock-outline"
                                  }}
                                </v-icon>
                                <span>{{ time.label }}</span>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </div>
                    </v-sheet>
                  </div>

                  <!-- Price Display -->
                  <v-expand-transition>
                    <div v-if="calculatePrice" class="price-section mb-6">
                      <v-sheet color="primary" class="price-card pa-4" rounded>
                        <div class="d-flex justify-space-between align-center">
                          <div>
                            <div class="text-subtitle-1 font-weight-medium">
                              Base Price
                            </div>
                            <div class="text-caption">
                              Final price may vary based on seat selection
                            </div>
                          </div>
                          <div class="text-h5 font-weight-bold">
                            $ {{ calculatePrice.toLocaleString() }}
                          </div>
                        </div>
                      </v-sheet>
                    </div>
                  </v-expand-transition>

                  <!-- Error Display -->
                  <v-expand-transition>
                    <div v-if="theaterError" class="mb-6">
                      <v-alert
                        type="error"
                        variant="tonal"
                        border="start"
                        class="mb-0"
                      >
                        {{ theaterError }}
                      </v-alert>
                    </div>
                  </v-expand-transition>

                  <!-- Booking Button -->
                  <v-card-actions class="px-0 pb-0">
                    <v-btn
                      color="primary"
                      size="large"
                      block
                      height="56"
                      :loading="bookingLoading"
                      :disabled="!canBook"
                      @click="handleBooking"
                    >
                      <v-icon class="mr-2">mdi-ticket-confirmation</v-icon>
                      Continue to Seat Selection
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { movieApi } from "@/api/movies";
import { useTheaters } from "@/composables/useTheaters";
import { useAuthStore } from "@/store/auth";
import { type ShowTime } from "@/api/showtimes";
import moment from "moment";
import { useTheme } from "vuetify";

const route = useRoute();
const router = useRouter();
const theme = useTheme();
const authStore = useAuthStore();

const scrollPosition = ref(0);
const movie = ref(null);
const loading = ref(true);
const bookingLoading = ref(false);

// Use the theaters composable
const {
  theaters,
  selectedTheater,
  selectedDate,
  selectedTime,
  availableDates,
  availableTimes,
  calculatePrice,
  canBook,
  loadTheaters,
  error: theaterError,
} = useTheaters(route.params.id as string);

// Replace isLoggedIn with auth store getter
const isLoggedIn = computed(() => authStore.isAuthenticated);

// Helper functions
const formatDuration = (minutes: number) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDate = (date: string) => {
  return moment(date).format("MMMM D, YYYY");
};

const handleDateSelect = (date: any) => {
  selectedDate.value = date.value;
  selectedTime.value = null; // Reset time when date changes
};

const handleTimeSelect = (time: any) => {
  if (time.isPast) return;
  selectedTime.value = time.value;
};

const onScroll = (e: Event) => {
  scrollPosition.value = window.scrollY;
};

const navigateToLogin = () => {
  router.push({
    path: "/auth/login",
    query: { redirect: route.fullPath },
  });
};

const handleBooking = async () => {
  try {
    if (!isLoggedIn.value) {
      navigateToLogin();
      return;
    }

    bookingLoading.value = true;

    if (!selectedTheater.value || !selectedTime.value) {
      throw new Error("Please select a theater and time");
    }

    // Store booking details in localStorage
    localStorage.setItem("movieDetails", JSON.stringify(movie.value));
    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        movieId: Number(route.params.id),
        theaterId: selectedTheater.value,
        date: selectedDate.value,
        time: selectedTime.value,
        price: calculatePrice.value,
      })
    );

    // Redirect to seat selection page
    router.push(`/movies/seat-selection`);
  } catch (error) {
    console.error("Error processing booking:", error);
    alert(error.message || "Failed to process booking");
  } finally {
    bookingLoading.value = false;
  }
};

const backdropGradient = computed(() => {
  return theme.global.current.value.dark
    ? "to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%"
    : "to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%";
});

onMounted(async () => {
  try {
    loading.value = true;
    const movieId = Number(route.params.id);

    // Fetch movie details and load theaters in parallel
    const [movieData] = await Promise.all([
      movieApi.getMovieById(movieId),
      loadTheaters(),
    ]);

    movie.value = movieData;

    if (!movie.value) {
      throw new Error("Movie not found");
    }
  } catch (error) {
    console.error("Error loading movie:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.movie-details {
  overflow-x: hidden;
}

.hero-section {
  position: relative;
  background-color: var(--v-surface-variant);
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.backdrop {
  position: relative;
}

.poster-image {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-out;
}

.movie-header {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-description {
  max-width: 800px;
  line-height: 1.6;
}

.booking-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.date-cards {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.date-card {
  cursor: pointer;
  min-width: 80px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.date-card:hover {
  transform: translateY(-2px);
  border-color: var(--v-primary-base);
}

.time-card {
  cursor: pointer;
  min-width: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.time-card:hover:not(.disabled) {
  transform: translateY(-2px);
  border-color: var(--v-primary-base);
}

.time-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.book-button {
  height: 48px;
  border-radius: 24px;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.blur-background {
  filter: blur(4px);
  pointer-events: none;
  opacity: 0.7;
}

.login-card {
  backdrop-filter: none !important;
  filter: none !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.slide-up-animation {
  animation: slideUp 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add smooth scrolling to the page */
html {
  scroll-behavior: smooth;
}

.movie-skeleton {
  max-width: 800px;

  :deep(.v-skeleton-loader__article) {
    border-radius: 8px;
    margin-bottom: 24px;
  }

  :deep(.v-skeleton-loader__actions) {
    margin-top: 16px;
  }
}

.booking-skeleton {
  :deep(.v-skeleton-loader__article) {
    margin-bottom: 24px;
  }

  :deep(.v-skeleton-loader__list-item-three-line) {
    margin: 24px 0;
  }

  :deep(.v-skeleton-loader__actions) {
    margin-top: 24px;
  }
}

.skeleton-hero {
  height: 400px;
  background: linear-gradient(
    to bottom,
    var(--v-surface-variant) 0%,
    rgba(var(--v-surface-variant-rgb), 0.8) 100%
  );
  position: relative;
  overflow: hidden;
}

.skeleton-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.theater-select {
  :deep(.v-field__input) {
    padding: 12px;
  }
}

.date-scroll {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--v-primary) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--v-primary);
    border-radius: 3px;
  }
}

.date-container {
  min-width: max-content;
}

.date-card {
  min-width: 90px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &:hover:not(.selected) {
    border-color: var(--v-primary);
  }

  &.selected {
    transform: translateY(-2px);
  }
}

.time-scroll {
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--v-primary) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--v-primary);
    border-radius: 3px;
  }
}

.time-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
}

.time-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &:hover:not(.disabled):not(.selected) {
    border-color: var(--v-primary);
  }

  &.selected {
    transform: translateY(-2px);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.price-card {
  background: linear-gradient(
    135deg,
    var(--v-primary),
    var(--v-primary-darken-1)
  );
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(var(--v-primary-rgb), 0.2);
  }
}

.gap-2 {
  gap: 8px;
}
</style>
