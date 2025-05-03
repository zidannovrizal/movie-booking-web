<template>
  <v-card
    :elevation="theme.global.current.value.dark ? 0 : 2"
    :class="[
      'movie-card',
      theme.global.current.value.dark ? 'bg-surface' : 'bg-white',
    ]"
    rounded="lg"
  >
    <v-img :src="movie.poster" :aspect-ratio="2 / 3" cover class="movie-poster">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </template>
      <div class="poster-overlay d-flex align-center justify-center">
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          class="text-none px-6"
          @click="$emit('book', movie)"
        >
          Book Now
        </v-btn>
      </div>
    </v-img>

    <v-card-item>
      <v-card-title class="text-truncate mb-1">
        {{ movie.title }}
      </v-card-title>
      <v-card-subtitle class="mb-2">
        {{ movie.genre }}
      </v-card-subtitle>

      <div class="d-flex align-center mb-2">
        <v-rating
          v-model="movie.rating"
          color="warning"
          density="compact"
          half-increments
          readonly
          size="small"
        ></v-rating>
        <span class="text-caption text-medium-emphasis ml-2">
          {{ movie.rating.toFixed(1) }}/5
        </span>
      </div>

      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon size="small" color="primary" class="mr-1">
            mdi-clock-outline
          </v-icon>
          <span class="text-caption text-medium-emphasis">
            {{ movie.duration }}
          </span>
        </div>
        <v-chip
          size="small"
          :color="movie.status === 'Now Showing' ? 'success' : 'info'"
          class="text-caption"
        >
          {{ movie.status }}
        </v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { useTheme } from "vuetify";

const theme = useTheme();

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

defineEmits(["book"]);
</script>

<style scoped>
.movie-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-poster {
  position: relative;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.movie-card:hover .poster-overlay {
  opacity: 1;
}
</style>
