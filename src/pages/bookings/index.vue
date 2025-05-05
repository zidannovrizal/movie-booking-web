<template>
  <div class="my-bookings-page pa-4">
    <Navbar />

    <v-container>
      <div class="mb-8">
        <h1 class="text-h4 mb-4">My Tickets</h1>

        <div v-if="bookingStore.loading" class="d-flex justify-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
        </div>

        <template v-else>
          <div v-if="bookings.length === 0" class="text-center py-12">
            <v-icon icon="mdi-ticket" size="64" color="primary"></v-icon>
            <h2 class="text-h5 mt-4">No tickets found</h2>
            <p class="text-body-1 text-medium-emphasis mt-2">
              You haven't booked any tickets yet.
            </p>
            <v-btn
              color="primary"
              class="mt-4"
              to="/movies"
              prepend-icon="mdi-movie"
            >
              Browse Movies
            </v-btn>
          </div>

          <v-row v-else>
            <v-col
              v-for="booking in bookings"
              :key="booking.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                :to="'/bookings/' + booking.id"
                class="h-100"
                :class="{ cancelled: booking.status === 'CANCELLED' }"
              >
                <v-img
                  :src="booking.showTime.movie.posterPath"
                  height="200"
                  cover
                  class="booking-image"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </div>
                  </template>
                </v-img>

                <v-card-item>
                  <v-chip
                    :color="getStatusColor(booking.status)"
                    size="small"
                    class="mb-2"
                  >
                    {{ booking.status }}
                  </v-chip>
                  <v-card-title class="text-truncate">
                    {{ booking.showTime.movie.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ formatDate(booking.showTime.startTime) }} •
                    {{ formatTime(booking.showTime.startTime) }}
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text>
                  <div class="d-flex align-center mb-2">
                    <v-icon
                      icon="mdi-theater"
                      size="small"
                      class="mr-2"
                    ></v-icon>
                    <span class="text-truncate">
                      {{ booking.showTime.theater.name }}
                    </span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon
                      icon="mdi-seat-recline-normal"
                      size="small"
                      class="mr-2"
                    ></v-icon>
                    <span>{{ booking.seats.length }} seats</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-cash" size="small" class="mr-2"></v-icon>
                    <span>Rp {{ formatPrice(booking.totalPrice) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useBookingStore } from "@/store/booking";
import { useAuthStore } from "@/store/auth";
import { formatDate, formatTime, formatPrice } from "@/utils/format";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const bookings = computed(() => bookingStore.bookings);

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "warning";
  }
};

onMounted(async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
      return;
    }

    await bookingStore.getUserBookings();
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
});
</script>

<style scoped>
.my-bookings-page {
  min-height: 100vh;
  background: var(--v-background-base, #121212);
}

.booking-image {
  position: relative;
}

.cancelled {
  opacity: 0.7;
}

.cancelled::after {
  content: "CANCELLED";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 1;
}
</style>
