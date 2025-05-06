<template>
  <div class="movie-details">
    <div
      v-if="loading"
      class="d-flex justify-center align-center"
      style="min-height: 80vh"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <template v-else-if="movie">
      <!-- Hero Section with Backdrop -->
      <div class="hero-section">
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
                ></v-img>
              </v-col>
              <v-col cols="12" sm="9" md="9">
                <div class="movie-header">
                  <h1 class="text-h3 font-weight-bold text-white mb-2">
                    {{ movie.title }}
                  </h1>
                  <div class="d-flex align-center flex-wrap mb-4">
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
                    class="text-body-2 text-white-darken-2 mt-4 movie-description"
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
              <v-card class="booking-card">
                <v-card-text>
                  <h2 class="text-h5 font-weight-bold mb-4">Book Tickets</h2>

                  <v-row>
                    <v-col cols="12" md="4">
                      <!-- Theater Selection -->
                      <v-select
                        v-model="selectedTheater"
                        :items="theaters"
                        item-title="name"
                        item-value="id"
                        label="Choose a theater"
                        variant="outlined"
                        density="compact"
                        class="mb-4"
                      ></v-select>
                    </v-col>

                    <!-- Date Selection -->
                    <v-col cols="12" md="4">
                      <div class="date-selection">
                        <div class="d-flex flex-wrap">
                          <v-card
                            v-for="date in availableDates"
                            :key="date.value"
                            :color="
                              selectedDate === date.value
                                ? 'primary'
                                : undefined
                            "
                            class="date-card mr-2 mb-2"
                            @click="handleDateSelect(date)"
                          >
                            <v-card-text class="text-center pa-2">
                              <div class="text-caption">{{ date.month }}</div>
                              <div class="text-h5">{{ date.date }}</div>
                              <div class="text-caption">{{ date.day }}</div>
                            </v-card-text>
                          </v-card>
                        </div>
                      </div>
                    </v-col>

                    <!-- Time Selection -->
                    <v-col cols="12" md="4">
                      <div class="time-selection">
                        <div class="d-flex flex-wrap">
                          <v-card
                            v-for="time in availableTimes"
                            :key="time.value"
                            :color="
                              selectedTime === time.value
                                ? 'primary'
                                : undefined
                            "
                            :class="{
                              'time-card': true,
                              'mr-2': true,
                              'mb-2': true,
                              disabled: time.isPast || !time.isAvailable,
                            }"
                            @click="
                              !time.isPast && time.isAvailable
                                ? (selectedTime = time.value)
                                : null
                            "
                          >
                            <v-card-text class="text-center pa-2">
                              {{ time.label }}
                            </v-card-text>
                          </v-card>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Price Display -->
                  <v-row v-if="calculatePrice" class="mt-4">
                    <v-col cols="12">
                      <div class="text-h6">
                        Base Price: $ {{ calculatePrice.toLocaleString() }}
                      </div>

                      <div class="text-caption mt-2">
                        * Final price may vary based on seat selection and day
                        of week
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Error Display -->
                  <v-row v-if="theaterError" class="mt-4">
                    <v-col cols="12">
                      <v-alert type="error" variant="tonal">
                        {{ theaterError }}
                      </v-alert>
                    </v-col>
                  </v-row>

                  <!-- Booking Button -->
                  <v-row class="mt-4">
                    <v-col cols="12" class="text-center">
                      <v-btn
                        color="primary"
                        size="large"
                        :loading="bookingLoading"
                        :disabled="!canBook"
                        @click="handleBooking"
                      >
                        Continue to Seat Selection
                      </v-btn>
                    </v-col>
                  </v-row>
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
import { type ShowTime } from "@/api/showtimes";
import moment from "moment";
import { useTheme } from "vuetify";

const route = useRoute();
const router = useRouter();
const theme = useTheme();

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

const handleBooking = async () => {
  try {
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
.hero-section {
  position: relative;
  background-color: var(--v-surface-variant);
}

.backdrop {
  position: relative;
}

.poster-image {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.movie-header {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-description {
  max-width: 800px;
}

.booking-card {
  border-radius: 12px;
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
  transition: all 0.3s ease;
}

.date-card:hover {
  transform: translateY(-2px);
}

.time-card {
  cursor: pointer;
  min-width: 100px;
  transition: all 0.3s ease;
}

.time-card:hover:not(.disabled) {
  transform: translateY(-2px);
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
</style>
