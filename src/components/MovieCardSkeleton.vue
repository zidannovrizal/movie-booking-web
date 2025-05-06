<template>
  <v-card class="movie-card h-100">
    <v-skeleton-loader class="mx-auto" type="card">
      <v-card-text>
        <v-skeleton-loader type="article" />
      </v-card-text>
    </v-skeleton-loader>
  </v-card>
</template>

<script setup lang="ts">
// No props or logic needed
</script>

<style scoped>
.movie-card {
  transition: transform 0.2s ease;
  height: 100%;
}
</style>
