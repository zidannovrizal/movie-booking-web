<template>
  <div class="booking-page pa-4">
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
          <h1 class="text-h4">Select Seats</h1>
        </div>

        <div class="movie-info mb-8">
          <v-row>
            <v-col cols="12" sm="4" md="3">
              <v-img
                :src="showtime?.movie?.posterPath"
                :aspect-ratio="2 / 3"
                cover
                class="rounded-lg"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="8" md="9">
              <h2 class="text-h4 mb-4">{{ showtime?.movie?.title }}</h2>
              <div class="text-body-1 mb-2">
                <v-icon icon="mdi-theater" class="mr-2"></v-icon>
                {{ showtime?.theater?.name }}
              </div>
              <div class="text-body-1 mb-2">
                <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
                {{ showtime?.theater?.city }}
              </div>
              <div class="text-body-1 mb-2">
                <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                {{ formatDate(showtime?.startTime) }}
              </div>
              <div class="text-body-1 mb-2">
                <v-icon icon="mdi-clock" class="mr-2"></v-icon>
                {{ formatTime(showtime?.startTime) }}
              </div>
              <div class="text-h6 mb-2">
                <v-icon icon="mdi-cash" class="mr-2"></v-icon>
                Rp {{ formatPrice(showtime?.price || 0) }} / seat
              </div>
            </v-col>
          </v-row>
        </div>

        <SeatPicker
          :price="showtime?.price || 0"
          :booked-seats="showtime?.bookings?.flatMap((b) => b.seats) || []"
          @confirm="handleConfirm"
        />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useShowtimeStore } from "@/store/showtime";
import { useAuthStore } from "@/store/auth";
import { useBookingStore } from "@/store/booking";
import { formatDate, formatTime, formatPrice } from "@/utils/format";
import SeatPicker from "@/components/SeatPicker.vue";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
const router = useRouter();
const showtimeStore = useShowtimeStore();
const authStore = useAuthStore();
const bookingStore = useBookingStore();

const showtime = ref(null);

onMounted(async () => {
  try {
    if (!authStore.isAuthenticated) {
      router.push({
        path: "/login",
        query: { redirect: route.fullPath },
      });
      return;
    }

    const id = route.params.id as string;
    showtime.value = await showtimeStore.getShowtime(id);
  } catch (error) {
    console.error("Error fetching showtime:", error);
  }
});

const handleConfirm = async (selectedSeats: string[]) => {
  try {
    if (!showtime.value?.id) return;

    const booking = await bookingStore.createBooking({
      showTimeId: showtime.value.id,
      seats: selectedSeats,
    });

    // Redirect to booking details/confirmation page
    router.push("/bookings/" + booking.id);
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};
</script>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: var(--v-background-base, #121212);
}
</style>
