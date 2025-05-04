<template>
  <v-container>
    <div
      v-if="loading"
      class="d-flex justify-center align-center"
      style="height: 400px"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="error" class="text-center pa-4">
      <p class="text-h6 text-error">{{ error }}</p>
      <v-btn color="primary" @click="$router.push('/')">Back to Home</v-btn>
    </div>

    <template v-else-if="movie">
      <!-- Movie Info Header -->
      <v-row class="mb-8">
        <v-col cols="12" sm="3">
          <v-img
            :src="movie.posterUrl || '/images/no-poster.png'"
            :alt="movie.title"
            class="rounded-lg"
            height="300"
            cover
          ></v-img>
        </v-col>
        <v-col cols="12" sm="9">
          <h1 class="text-h4 mb-2">{{ movie.title }}</h1>
          <p class="text-subtitle-1 mb-4">{{ movie.tagline }}</p>
          <div class="d-flex flex-wrap gap-4">
            <div>
              <v-icon icon="mdi-clock-outline" class="mr-1"></v-icon>
              {{ formatRuntime(movie.runtime) }}
            </div>
            <div>
              <v-icon icon="mdi-star" class="mr-1"></v-icon>
              {{ formatRating(movie.rating) }}/10
            </div>
            <div>
              <v-icon icon="mdi-tag-multiple" class="mr-1"></v-icon>
              {{ movie.genres }}
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Booking Form -->
      <v-card class="mb-8">
        <v-card-title class="text-h5 px-6 py-4"> Book Tickets </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Theater Selection -->
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedTheater"
                :items="theaters"
                item-title="name"
                item-value="id"
                label="Select Theater"
                variant="outlined"
                :rules="[(v) => !!v || 'Theater is required']"
                @update:model-value="handleTheaterChange"
              ></v-select>
            </v-col>

            <!-- Date Selection -->
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedDate"
                :items="availableDates"
                label="Select Date"
                variant="outlined"
                :rules="[(v) => !!v || 'Date is required']"
                @update:model-value="handleDateChange"
              ></v-select>
            </v-col>

            <!-- Time Selection -->
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedTime"
                :items="availableShowtimes"
                item-title="formattedTime"
                item-value="id"
                label="Select Time"
                variant="outlined"
                :rules="[(v) => !!v || 'Time is required']"
                :disabled="!selectedDate || !selectedTheater"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Seat Selection -->
          <div v-if="selectedTime" class="mt-6">
            <h3 class="text-h6 mb-4">Select Seats</h3>
            <div class="seat-layout pa-4 text-center">
              <!-- Screen -->
              <div class="screen mb-8">
                <div class="screen-label text-caption mb-2">SCREEN</div>
                <div class="screen-line"></div>
              </div>

              <!-- Seats -->
              <div class="seats-container">
                <div v-for="row in seatRows" :key="row" class="seat-row mb-2">
                  <div class="row-label mr-4">{{ row }}</div>
                  <v-btn
                    v-for="col in seatsPerRow"
                    :key="`${row}${col}`"
                    :color="getSeatColor(`${row}${col}`)"
                    :disabled="isBooked(`${row}${col}`)"
                    size="small"
                    class="mx-1"
                    @click="toggleSeat(`${row}${col}`)"
                  >
                    {{ col }}
                  </v-btn>
                </div>
              </div>

              <!-- Legend -->
              <div class="seat-legend mt-8 d-flex justify-center gap-4">
                <div class="d-flex align-center">
                  <v-btn size="small" color="primary" class="mr-2" disabled
                    >A1</v-btn
                  >
                  <span class="text-caption">Available</span>
                </div>
                <div class="d-flex align-center">
                  <v-btn size="small" color="primary" class="mr-2">A1</v-btn>
                  <span class="text-caption">Selected</span>
                </div>
                <div class="d-flex align-center">
                  <v-btn size="small" color="grey" class="mr-2" disabled
                    >A1</v-btn
                  >
                  <span class="text-caption">Booked</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <v-card
            v-if="selectedSeats.length > 0"
            class="mt-6"
            variant="outlined"
          >
            <v-card-text>
              <h3 class="text-h6 mb-4">Booking Summary</h3>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-theater"></v-icon>
                  </template>
                  <v-list-item-title>Theater</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedTheaterName
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar"></v-icon>
                  </template>
                  <v-list-item-title>Date & Time</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ selectedDate }} at {{ selectedShowtime?.formattedTime }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-seat"></v-icon>
                  </template>
                  <v-list-item-title>Seats</v-list-item-title>
                  <v-list-item-subtitle>{{
                    selectedSeats.join(", ")
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-cash"></v-icon>
                  </template>
                  <v-list-item-title>Total Price</v-list-item-title>
                  <v-list-item-subtitle>
                    ${{ (selectedShowtime?.price || 0) * selectedSeats.length }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            size="large"
            :disabled="!canProceed"
            :loading="isBooking"
            @click="handleBooking"
          >
            Proceed to Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { movieApi } from "@/api/movies";
import { theaterApi } from "@/api/theaters";
import { bookingApi } from "@/api/bookings";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// State
const movie = ref(null);
const theaters = ref([]);
const loading = ref(true);
const error = ref(null);
const isBooking = ref(false);

const selectedTheater = ref(null);
const selectedDate = ref(null);
const selectedTime = ref(null);
const selectedSeats = ref([]);
const availableShowtimes = ref([]);
const bookedSeats = ref([]);

// Constants
const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 12;

// Computed
const selectedTheaterName = computed(() => {
  const theater = theaters.value.find((t) => t.id === selectedTheater.value);
  return theater?.name || "";
});

const selectedShowtime = computed(() => {
  return availableShowtimes.value.find((t) => t.id === selectedTime.value);
});

const canProceed = computed(() => {
  return (
    selectedTheater.value &&
    selectedDate.value &&
    selectedTime.value &&
    selectedSeats.value.length > 0
  );
});

const availableDates = computed(() => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      text:
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            }),
      value: date.toISOString().split("T")[0],
    });
  }

  return dates;
});

// Methods
const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : "N/A";
};

const handleTheaterChange = async () => {
  selectedTime.value = null;
  selectedSeats.value = [];
  if (selectedTheater.value && selectedDate.value) {
    await fetchShowtimes();
  }
};

const handleDateChange = async () => {
  selectedTime.value = null;
  selectedSeats.value = [];
  if (selectedTheater.value && selectedDate.value) {
    await fetchShowtimes();
  }
};

const fetchShowtimes = async () => {
  try {
    // TODO: Replace with actual API call
    const response = await theaterApi.getShowtimes({
      theaterId: selectedTheater.value,
      movieId: Number(route.params.movieId),
      date: selectedDate.value,
    });

    availableShowtimes.value = response.map((showtime) => ({
      ...showtime,
      formattedTime: new Date(`2000-01-01T${showtime.time}`).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      ),
    }));
  } catch (err) {
    console.error("Error fetching showtimes:", err);
    error.value = "Failed to load showtimes";
  }
};

const fetchBookedSeats = async () => {
  try {
    if (!selectedTime.value) return;
    // TODO: Replace with actual API call
    const response = await bookingApi.getBookedSeats(selectedTime.value);
    bookedSeats.value = response;
  } catch (err) {
    console.error("Error fetching booked seats:", err);
  }
};

const handleBooking = async () => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }

  try {
    isBooking.value = true;
    // TODO: Replace with actual API call
    await bookingApi.createBooking({
      movieId: Number(route.params.movieId),
      theaterId: selectedTheater.value,
      showtimeId: selectedTime.value,
      seats: selectedSeats.value,
      totalPrice:
        (selectedShowtime.value?.price || 0) * selectedSeats.value.length,
    });

    router.push({
      path: "/booking/success",
      query: {
        movie: movie.value.title,
        theater: selectedTheaterName.value,
        date: selectedDate.value,
        time: selectedShowtime.value?.formattedTime,
        seats: selectedSeats.value.join(","),
      },
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    error.value = "Failed to create booking";
  } finally {
    isBooking.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    const [movieData, theatersData] = await Promise.all([
      movieApi.getMovieById(Number(route.params.movieId)),
      theaterApi.getTheaters(),
    ]);

    movie.value = movieData;
    theaters.value = theatersData;

    if (!movie.value) {
      error.value = "Movie not found";
    }
  } catch (err) {
    console.error("Error loading movie:", err);
    error.value = "Failed to load movie details";
  } finally {
    loading.value = false;
  }
});

// Watch for changes
watch(selectedTime, async () => {
  selectedSeats.value = [];
  if (selectedTime.value) {
    await fetchBookedSeats();
  }
});
</script>

<style scoped>
.seat-layout {
  max-width: 800px;
  margin: 0 auto;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
}

.screen {
  position: relative;
  margin-bottom: 48px;
}

.screen-label {
  color: rgb(var(--v-theme-on-surface-variant));
}

.screen-line {
  height: 8px;
  background: linear-gradient(
    to bottom,
    rgb(var(--v-theme-primary)) 0%,
    rgba(var(--v-theme-primary), 0.3) 100%
  );
  border-radius: 4px;
  transform: perspective(500px) rotateX(-30deg);
  transform-origin: center top;
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.3);
}

.seats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.seat-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-label {
  width: 24px;
  text-align: right;
  color: rgb(var(--v-theme-on-surface-variant));
}

.seat-legend {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding-top: 16px;
}

:deep(.v-btn--size-small) {
  min-width: 32px !important;
  padding: 0 !important;
}
</style>
