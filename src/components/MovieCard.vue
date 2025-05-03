<template>
  <v-card
    :to="`/movie-details/${movie.id}`"
    class="movie-card"
    elevation="0"
    hover
  >
    <div class="card-content">
      <v-img
        :src="movie.poster"
        :alt="movie.title"
        class="movie-poster"
        gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)"
        height="360"
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

      <div class="movie-info pa-4">
        <h3 class="text-h6 font-weight-medium text-truncate mb-2">
          {{ movie.title }}
        </h3>

        <div class="d-flex align-center mb-3">
          <v-chip color="primary" size="small" class="mr-2 font-weight-medium">
            {{ movie.genre }}
          </v-chip>
          <span class="text-caption text-medium-emphasis">{{
            movie.duration
          }}</span>
        </div>

        <div class="d-flex align-center justify-space-between">
          <div class="rating-container d-flex align-center">
            <v-rating
              :model-value="movie.rating"
              color="amber-darken-2"
              density="compact"
              half-increments
              readonly
              size="x-small"
            ></v-rating>
            <span class="text-caption font-weight-medium ml-1"
              >{{ movie.rating }}/5</span
            >
          </div>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            rounded="pill"
            class="book-btn text-none px-6"
            @click.stop="$emit('book')"
          >
            Book Now
          </v-btn>
        </div>
      </div>

      <div class="overlay">
        <div class="overlay-content pa-4">
          <h3 class="text-h6 font-weight-bold mb-2">{{ movie.title }}</h3>
          <p class="text-body-2 mb-4">
            Experience this amazing movie in theaters now!
          </p>
          <v-btn
            color="white"
            variant="flat"
            block
            rounded="pill"
            class="text-none"
            @click.stop="$emit('book')"
          >
            Book Tickets
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
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
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12);
}

.card-content {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
}

.movie-poster {
  transition: transform 0.3s ease;
}

.movie-info {
  background: rgb(var(--v-theme-surface));
}

.book-btn {
  transition: all 0.3s ease;
}

.book-btn:hover {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
}

.movie-card:hover .overlay {
  opacity: 1;
}

.movie-card:hover .movie-poster {
  transform: scale(1.1);
}

.overlay-content {
  color: white;
  width: 100%;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.movie-card:hover .overlay-content {
  transform: translateY(0);
}

.rating-container {
  background: rgba(var(--v-theme-surface), 0.9);
  padding: 4px 8px;
  border-radius: 12px;
}
</style>
