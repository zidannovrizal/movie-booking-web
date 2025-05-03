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
      <v-row>
        <v-col cols="12" md="4">
          <v-img
            :src="movie.poster"
            :alt="movie.title"
            class="rounded-lg"
            height="500"
            cover
          ></v-img>
        </v-col>

        <v-col cols="12" md="8">
          <h1 class="text-h3 mb-4">{{ movie.title }}</h1>

          <div class="d-flex align-center mb-6">
            <v-rating
              :model-value="movie.rating"
              color="amber"
              half-increments
              readonly
            ></v-rating>
            <span class="ms-2 text-h6">{{ movie.rating }}/5</span>
          </div>

          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-clock-outline</v-icon>
              </template>
              <v-list-item-title>Duration</v-list-item-title>
              <v-list-item-subtitle>{{ movie.duration }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-movie</v-icon>
              </template>
              <v-list-item-title>Genre</v-list-item-title>
              <v-list-item-subtitle>{{ movie.genre }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon>mdi-calendar</v-icon>
              </template>
              <v-list-item-title>Release Date</v-list-item-title>
              <v-list-item-subtitle>{{
                formatReleaseDate(movie.releaseDate)
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-card class="mt-6 pa-4">
            <h2 class="text-h5 mb-4">Book Tickets</h2>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedDate"
                  :items="availableDates"
                  label="Select Date"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectedTime"
                  :items="availableTimes"
                  label="Select Time"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  block
                  size="large"
                  @click="handleBooking"
                >
                  Book Now
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMovies } from "@/composables/useMovies";
import { useMovieStore } from "@/store/movies";

const route = useRoute();
const store = useMovieStore();
const { formatReleaseDate } = useMovies();

const movie = ref(null);
const loading = ref(true);
const error = ref(null);

// Mock data for booking
const selectedDate = ref("");
const selectedTime = ref("");
const availableDates = ["Today", "Tomorrow", "Day after tomorrow"];
const availableTimes = [
  "10:00 AM",
  "1:00 PM",
  "4:00 PM",
  "7:00 PM",
  "10:00 PM",
];

const handleBooking = () => {
  // TODO: Implement booking logic when backend is ready
  console.log("Booking movie:", {
    movieId: route.params.id,
    date: selectedDate.value,
    time: selectedTime.value,
  });
};

onMounted(async () => {
  try {
    await store.fetchMovies(); // In real app, we would fetch single movie by ID
    movie.value = store.getMovieById(Number(route.params.id));
    if (!movie.value) {
      error.value = "Movie not found";
    }
  } catch (err) {
    error.value = "Failed to load movie details";
  } finally {
    loading.value = false;
  }
});
</script>
