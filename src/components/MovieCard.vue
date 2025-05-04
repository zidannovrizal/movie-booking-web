<template>
  <div class="movie-card">
    <div class="movie-poster" :style="posterStyle">
      <div class="movie-overlay">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <router-link :to="`/movies/${movie.id}`">
          <v-btn color="primary" variant="flat" class="mt-2">
            View Details
          </v-btn>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MovieStatus, type Movie } from "@/types";
import { computed } from "vue";

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

const truncateDescription = (text: string | undefined | null, length = 100) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

const posterStyle = computed(() => ({
  backgroundImage: `url(${props.movie.posterUrl || "/images/no-poster.png"})`,
}));
</script>

<style scoped>
.movie-card {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-poster {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-title {
  color: white;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
