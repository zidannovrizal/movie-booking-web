<template>
  <v-container class="success-page py-16">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="text-center pa-8">
          <v-icon
            icon="mdi-check-circle"
            color="success"
            size="64"
            class="mb-4"
          ></v-icon>

          <h1 class="text-h4 font-weight-bold mb-4">Booking Confirmed!</h1>

          <p class="text-body-1 text-medium-emphasis mb-8">
            Thank you for booking with us. Your tickets have been confirmed and
            sent to your email.
          </p>

          <v-card variant="outlined" class="mb-8">
            <v-card-text>
              <v-list>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-movie" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>Movie</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $route.query.movie
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-theater" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>Theater</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $route.query.theater
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-calendar" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>Date</v-list-item-title>
                  <v-list-item-subtitle>{{
                    formatDate($route.query.date)
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-clock" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>Time</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $route.query.time
                  }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon icon="mdi-seat" color="primary"></v-icon>
                  </template>
                  <v-list-item-title>Seats</v-list-item-title>
                  <v-list-item-subtitle>{{
                    $route.query.seats
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              to="/my-bookings"
              class="flex-grow-0"
            >
              View My Bookings
            </v-btn>
            <v-btn
              variant="outlined"
              size="large"
              to="/movies"
              class="flex-grow-0"
            >
              Browse More Movies
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.success-page {
  min-height: calc(100vh - 64px);
}

.gap-4 {
  gap: 1rem;
}
</style>
