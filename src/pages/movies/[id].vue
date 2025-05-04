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
                    <v-col cols="12">
                      <div class="d-flex overflow-x-auto date-cards pb-2">
                        <v-card
                          v-for="date in availableDates"
                          :key="date.value"
                          :color="
                            selectedDate === date.value ? 'primary' : undefined
                          "
                          :variant="
                            selectedDate === date.value ? 'flat' : 'outlined'
                          "
                          @click="handleDateSelect(date)"
                          class="date-card mr-2"
                          min-width="100"
                          elevation="0"
                        >
                          <v-card-text class="text-center pa-2">
                            <div class="text-body-2 font-weight-bold">
                              {{ date.day }}
                            </div>
                            <div class="text-h6 font-weight-bold">
                              {{ date.date }}
                            </div>
                            <div class="text-caption">{{ date.month }}</div>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-col>

                    <!-- Showtime Selection -->
                    <v-col cols="12">
                      <div class="d-flex flex-wrap">
                        <v-card
                          v-for="time in availableShowtimes"
                          :key="time.value"
                          :color="
                            selectedTime === time.value ? 'primary' : undefined
                          "
                          :variant="
                            selectedTime === time.value ? 'flat' : 'outlined'
                          "
                          :disabled="time.isPast"
                          @click="handleTimeSelect(time)"
                          class="time-card mr-2 mb-2"
                          elevation="0"
                          width="90"
                        >
                          <v-card-text class="text-center pa-2">
                            <div class="text-body-1 font-weight-medium">
                              {{ time.label }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Book Button -->
                  <v-btn
                    color="primary"
                    size="large"
                    :disabled="!canBook"
                    :loading="bookingLoading"
                    @click="handleBooking"
                    class="book-button mt-4"
                    block
                  >
                    Book Now
                    <v-icon class="ml-2">mdi-arrow-right</v-icon>
                  </v-btn>
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
import moment from "moment";
import { useTheme } from "vuetify";

const route = useRoute();
const router = useRouter();
const theme = useTheme();

const movie = ref(null);
const loading = ref(true);
const bookingLoading = ref(false);

// Booking form data
const selectedTheater = ref("");
const selectedDate = ref(moment().format("YYYY-MM-DD"));
const selectedTime = ref(null);

// Mock theaters data (replace with API data later)
const theaters = [
  { id: 1, name: "Cineplex Downtown" },
  { id: 2, name: "IMAX City Center" },
  { id: 3, name: "MovieMax Mall" },
];

// Generate available dates (next 7 days)
const availableDates = computed(() => {
  const dates = [];
  const today = moment();

  for (let i = 0; i < 7; i++) {
    const date = moment().add(i, "days");
    dates.push({
      value: date.format("YYYY-MM-DD"),
      day: date.format("ddd").toUpperCase(),
      date: date.format("D"),
      month: date.format("MMM"),
      isToday: date.isSame(today, "day"),
    });
  }

  return dates;
});

// Generate showtimes
const availableShowtimes = computed(() => {
  if (!selectedDate.value) return [];

  const times = [];
  const now = moment();
  const selectedMoment = moment(selectedDate.value);
  const isToday = selectedMoment.isSame(now, "day");
  const currentHour = now.hour();

  // Showtimes from 10 AM to 10 PM, every 2 hours
  for (let hour = 10; hour <= 22; hour += 2) {
    const time = moment(selectedDate.value).hour(hour).minute(0);
    const isPast = isToday && hour <= currentHour;

    times.push({
      value: time.format("HH:mm"),
      label: time.format("HH:mm"),
      isPast,
    });
  }

  return times;
});

const canBook = computed(() => {
  return selectedTheater.value && selectedDate.value && selectedTime.value;
});

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
  if (!time.isPast) {
    selectedTime.value = time.value;
  }
};

const handleBooking = async () => {
  try {
    bookingLoading.value = true;
    // TODO: Implement booking API call
    console.log("Booking:", {
      movieId: route.params.id,
      theaterId: selectedTheater.value,
      date: selectedDate.value,
      time: selectedTime.value,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    router.push("/bookings");
  } catch (error) {
    console.error("Error booking movie:", error);
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
    const data = await movieApi.getMovieById(Number(route.params.id));
    movie.value = data;
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
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
}

.poster-image {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.movie-header {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-description {
  max-width: 800px;
  line-height: 1.5;
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
  transition: all 0.2s ease;

  &:hover:not(.v-card--disabled) {
    transform: translateY(-2px);
  }
}

.time-card {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.v-card--disabled) {
    transform: translateY(-2px);
  }

  &.v-card--disabled {
    opacity: 0.5;
  }
}

.book-button {
  height: 48px;
  border-radius: 24px;
  font-size: 1rem;
  letter-spacing: 0.5px;
}
</style>
