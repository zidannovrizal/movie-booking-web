<template>
  <div class="booking-details-page pa-4">
    <Navbar />

    <v-container>
      <div class="mb-8">
        <div class="d-flex align-center mb-4">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            size="small"
            class="mr-4"
            @click="router.back()"
          ></v-btn>
          <h1 class="text-h4">Booking Details</h1>
        </div>

        <v-card v-if="booking" class="booking-card">
          <div class="booking-header pa-4">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-overline">Booking ID</div>
                <div class="text-body-1">{{ booking.id }}</div>
              </div>
              <v-chip
                :color="getStatusColor(booking.status)"
                class="text-uppercase"
              >
                {{ booking.status }}
              </v-chip>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="pa-4">
            <v-row>
              <v-col cols="12" sm="4" md="3">
                <v-img
                  :src="booking.showTime.movie.posterPath"
                  :aspect-ratio="2 / 3"
                  cover
                  class="rounded-lg"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8" md="9">
                <h2 class="text-h4 mb-4">
                  {{ booking.showTime.movie.title }}
                </h2>
                <div class="text-body-1 mb-2">
                  <v-icon icon="mdi-theater" class="mr-2"></v-icon>
                  {{ booking.showTime.theater.name }}
                </div>
                <div class="text-body-1 mb-2">
                  <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
                  {{ booking.showTime.theater.city }}
                </div>
                <div class="text-body-1 mb-2">
                  <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                  {{ formatDate(booking.showTime.startTime) }}
                </div>
                <div class="text-body-1 mb-2">
                  <v-icon icon="mdi-clock" class="mr-2"></v-icon>
                  {{ formatTime(booking.showTime.startTime) }}
                </div>
                <div class="text-body-1 mb-2">
                  <v-icon icon="mdi-seat" class="mr-2"></v-icon>
                  Seats: {{ booking.seats.join(", ") }}
                </div>
                <div class="text-h6 mb-4">
                  <v-icon icon="mdi-cash" class="mr-2"></v-icon>
                  Total: Rp {{ formatPrice(booking.totalPrice) }}
                </div>

                <v-btn
                  v-if="booking.status === 'PENDING'"
                  color="error"
                  variant="outlined"
                  @click="handleCancel"
                  :loading="bookingStore.loading"
                >
                  Cancel Booking
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>

        <v-card v-else-if="bookingStore.loading" class="pa-4">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card>

        <v-card v-else class="pa-4">
          <div class="text-center">
            <v-icon icon="mdi-alert" size="48" color="error"></v-icon>
            <div class="text-h6 mt-2">Booking not found</div>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "@/store/booking";
import { formatDate, formatTime, formatPrice } from "@/utils/format";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const booking = computed(() => bookingStore.currentBooking);

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
    const id = route.params.id as string;
    await bookingStore.getBooking(id);
  } catch (error) {
    console.error("Error fetching booking:", error);
  }
});

const handleCancel = async () => {
  try {
    if (!booking.value?.id) return;

    await bookingStore.cancelBooking(booking.value.id);
  } catch (error) {
    console.error("Error cancelling booking:", error);
  }
};
</script>

<style scoped>
.booking-details-page {
  min-height: 100vh;
  background: var(--v-background-base, #121212);
}

.booking-card {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
