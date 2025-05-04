<template>
  <v-card class="movie-card h-100" :elevation="2">
    <v-img
      :src="movie.posterUrl"
      :alt="movie.title"
      class="movie-poster"
      height="300"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-item>
      <v-card-title class="text-h6 mb-1">{{ movie.title }}</v-card-title>
      <v-card-subtitle class="mb-2">
        <v-chip
          size="small"
          :color="movie.status === 'NOW_SHOWING' ? 'success' : 'info'"
          class="mr-2"
        >
          {{ formatStatus(movie.status) }}
        </v-chip>
        <v-chip size="small" color="primary" variant="outlined">
          {{ movie.genre }}
        </v-chip>
      </v-card-subtitle>
      <v-card-text class="text-body-2 text-medium-emphasis">
        <p class="mb-2">{{ truncateDescription(movie.description) }}</p>
        <div class="d-flex align-center mt-2">
          <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
          <span>{{ formatDuration(movie.duration) }}</span>
        </div>
      </v-card-text>
    </v-card-item>

    <v-card-actions class="pa-4 pt-0">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="tonal"
        class="text-none"
        @click="$emit('book', movie)"
      >
        Book Now
      </v-btn>
      <v-btn variant="outlined" class="text-none ml-2" @click="showDetails">
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { MovieStatus, type Movie } from "@/types";

const props = defineProps<{
  movie: Movie;
}>();

const emit = defineEmits<{
  (e: "book", movie: Movie): void;
}>();

const formatStatus = (status: MovieStatus) => {
  return status === MovieStatus.NOW_SHOWING ? "Now Showing" : "Coming Soon";
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const truncateDescription = (text: string, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const showDetails = () => {
  // TODO: Implement movie details navigation
  console.log("Show details for movie:", props.movie.id);
};
</script>

<style scoped>
.movie-card {
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-poster {
  position: relative;
}

.movie-poster::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}
</style>
