<template>
  <div class="seat-selection">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="9">
          <!-- Skeleton Loading -->
          <template v-if="loading">
            <v-card class="seat-selection-card">
              <div class="movie-info-header">
                <div class="movie-info-backdrop"></div>
                <div class="movie-info-content pa-6">
                  <v-row align="center" no-gutters>
                    <v-col cols="12" sm="auto" class="movie-poster-col">
                      <v-skeleton-loader
                        type="image"
                        height="300"
                        width="200"
                      ></v-skeleton-loader>
                    </v-col>
                    <v-col cols="12" sm class="movie-details-col">
                      <v-skeleton-loader
                        type="article"
                        class="mt-4"
                      ></v-skeleton-loader>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <v-divider></v-divider>
              <div class="seat-selection-area pa-6">
                <v-skeleton-loader
                  type="article"
                  class="mb-8"
                ></v-skeleton-loader>
                <v-skeleton-loader
                  type="table"
                  class="mb-8"
                ></v-skeleton-loader>
              </div>
            </v-card>
          </template>

          <v-card v-else class="seat-selection-card">
            <!-- Movie Info Header -->
            <div class="movie-info-header">
              <div class="movie-info-backdrop"></div>
              <div class="movie-info-content pa-6">
                <v-row align="center" no-gutters>
                  <v-col cols="12" sm="auto" class="movie-poster-col">
                    <v-img
                      :src="movieDetails?.posterUrl || '/images/no-poster.png'"
                      :aspect-ratio="2 / 3"
                      cover
                      class="movie-poster"
                      width="200"
                    >
                      <template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </v-col>
                  <v-col cols="12" sm class="movie-details-col">
                    <div class="d-flex flex-column h-100">
                      <h2 class="text-h3 font-weight-bold mb-2">
                        {{ movieDetails?.title }}
                      </h2>
                      <div class="d-flex align-center flex-wrap mb-4 gap-2">
                        <v-chip
                          v-for="genre in movieDetails?.genres?.split(',')"
                          :key="genre"
                          color="primary"
                          variant="elevated"
                          size="small"
                          class="font-weight-medium"
                        >
                          {{ genre.trim() }}
                        </v-chip>
                      </div>
                      <div class="movie-info-meta mb-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon size="20" color="primary" class="mr-2"
                            >mdi-calendar-clock</v-icon
                          >
                          <span class="text-body-1 font-weight-medium">
                            {{
                              formatDateTime(
                                bookingDetails?.date,
                                bookingDetails?.time
                              )
                            }}
                          </span>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="20" color="primary" class="mr-2"
                            >mdi-theater</v-icon
                          >
                          <span class="text-body-1 font-weight-medium">{{
                            theaterName
                          }}</span>
                        </div>
                      </div>
                      <div class="booking-progress">
                        <div
                          class="d-flex align-center justify-space-between mb-2"
                        >
                          <span class="text-subtitle-1 font-weight-medium"
                            >Booking Progress</span
                          >
                          <span class="text-caption">Step 2 of 3</span>
                        </div>
                        <v-progress-linear
                          color="primary"
                          height="8"
                          rounded
                          :model-value="66"
                          class="booking-progress-bar"
                        ></v-progress-linear>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>

            <v-divider></v-divider>

            <!-- Seat Selection Area -->
            <div class="seat-selection-area pa-6">
              <!-- Seat Legend -->
              <div class="d-flex justify-center align-center mb-0">
                <div class="d-flex align-center mr-8">
                  <div class="seat-demo regular"></div>
                  <span class="ml-2 text-body-2"
                    >Regular ($ {{ formatPrice(basePrice) }})</span
                  >
                </div>
                <div class="d-flex align-center mr-8">
                  <div class="seat-demo vip"></div>
                  <span class="ml-2 text-body-2"
                    >VIP ($ {{ formatPrice(vipPrice) }})</span
                  >
                </div>
                <div class="d-flex align-center">
                  <div class="seat-demo occupied"></div>
                  <span class="ml-2 text-body-2">Occupied</span>
                </div>
              </div>

              <!-- Seats Grid -->
              <div class="seats-container mb-8 pt-16">
                <div v-for="row in 8" :key="row" class="seat-row">
                  <div class="row-label">
                    {{ String.fromCharCode(64 + row) }}
                  </div>
                  <div
                    v-for="col in 12"
                    :key="col"
                    class="seat"
                    :class="{
                      occupied: isOccupied(row, col),
                      selected: isSelected(row, col),
                      vip: isVipSeat(row, col),
                    }"
                    @click="toggleSeat(row, col)"
                    @mouseenter="handleSeatHover(row, col)"
                    @mouseleave="hoveredSeat = null"
                  >
                    <span class="seat-number">{{ col }}</span>
                    <div
                      v-if="
                        hoveredSeat?.row === row && hoveredSeat?.col === col
                      "
                      class="seat-tooltip"
                    >
                      {{ getSeatPrice(row, col) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Screen -->
              <div class="screen-container mb-6">
                <div class="screen">
                  <span class="screen-text">SCREEN</span>
                </div>
                <div class="screen-shadow"></div>
              </div>
            </div>

            <!-- Booking Summary -->
            <v-divider></v-divider>
            <div class="booking-summary pa-6">
              <v-row>
                <v-col cols="12">
                  <div class="selected-seats mb-4">
                    <h3 class="text-h6 font-weight-medium mb-2">
                      Selected Seats
                    </h3>
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="seat in selectedSeats"
                        :key="`${seat.row}-${seat.col}`"
                        color="primary"
                        variant="flat"
                        closable
                        @click:close="toggleSeat(seat.row, seat.col)"
                      >
                        {{ formatSeatLabel(seat) }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="price-breakdown mb-6">
                    <div class="d-flex justify-space-between mb-2">
                      <span>Regular Seats ({{ regularSeatsCount }})</span>
                      <span
                        >$
                        {{ formatPrice(regularSeatsCount * basePrice) }}</span
                      >
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <span>VIP Seats ({{ vipSeatsCount }})</span>
                      <span>$ {{ formatPrice(vipSeatsCount * vipPrice) }}</span>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div class="d-flex justify-space-between">
                      <span class="text-h6">Total</span>
                      <span class="text-h6"
                        >$ {{ formatPrice(totalPrice) }}</span
                      >
                    </div>
                  </div>
                  <v-btn
                    color="primary"
                    block
                    size="large"
                    height="56"
                    :disabled="selectedSeats.length === 0"
                    :loading="loading"
                    @click="confirmBooking"
                  >
                    <v-icon class="mr-2">mdi-ticket-confirmation</v-icon>
                    Confirm Booking
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="500">
      <v-card class="confirmation-dialog">
        <v-card-text class="pa-6">
          <div class="text-center mb-6">
            <v-icon size="64" color="primary" class="mb-4"
              >mdi-ticket-confirmation</v-icon
            >
            <h2 class="text-h4 font-weight-bold mb-2">Confirm Booking</h2>
            <p class="text-body-1 text-medium-emphasis">
              Please review your booking details before proceeding with payment
            </p>
          </div>

          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-movie</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{
                movieDetails?.title
              }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">
                {{ formatDateTime(bookingDetails?.date, bookingDetails?.time) }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-theater</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{
                theaterName
              }}</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-seat</v-icon>
              </template>
              <v-list-item-title class="font-weight-medium">{{
                selectedSeatsLabel
              }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ vipSeatsCount > 0 ? `${vipSeatsCount} VIP, ` : "" }}
                {{
                  regularSeatsCount > 0 ? `${regularSeatsCount} Regular` : ""
                }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-cash</v-icon>
              </template>
              <v-list-item-title class="text-primary font-weight-bold">
                $ {{ formatPrice(totalPrice) }}
              </v-list-item-title>
              <v-list-item-subtitle>Total Price</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <div class="d-flex flex-column w-100 gap-2">
            <v-btn
              color="grey"
              variant="outlined"
              block
              class="mr-2"
              @click="showConfirmDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              block
              :loading="loading"
              @click="processBooking"
            >
              Confirm & Pay
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="400">
      <v-card class="success-dialog">
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon size="48" color="success" class="mb-3"
              >mdi-check-circle</v-icon
            >
            <h2 class="text-h5 font-weight-bold mb-2">Booking Successful!</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Your movie tickets have been booked successfully
            </p>
          </div>

          <div class="d-flex flex-column gap-2">
            <v-btn
              color="primary"
              variant="flat"
              block
              to="/my-tickets"
              prepend-icon="mdi-ticket-confirmation"
            >
              View My Tickets
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              block
              to="/"
              prepend-icon="mdi-movie"
            >
              Browse More Movies
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { bookingApi } from "@/api/bookings";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);

// Mock data - In real app, these would come from route params/query or store
const movieDetails = ref(
  JSON.parse(localStorage.getItem("movieDetails") || "{}")
);
const bookingDetails = ref(
  JSON.parse(localStorage.getItem("bookingDetails") || "{}")
);

// Fetch booked seats
const occupiedSeats = ref<Array<{ row: number; col: number }>>([]);

const fetchBookedSeats = async () => {
  try {
    if (
      !bookingDetails.value?.theaterId ||
      !bookingDetails.value?.date ||
      !bookingDetails.value?.time
    ) {
      return;
    }

    const response = await bookingApi.getBookedSeats({
      theaterId: bookingDetails.value.theaterId,
      showDate: bookingDetails.value.date,
      showTime: bookingDetails.value.time,
      movieId: bookingDetails.value.movieId,
    });

    // The response.data contains the array of booked seats
    const bookedSeats = response.data;
    console.log("Booked seats:", bookedSeats);

    // Convert seat numbers (e.g., "A1", "B2") to row and col numbers
    occupiedSeats.value = bookedSeats.map((seatNumber) => {
      const row = seatNumber.charCodeAt(0) - 64; // Convert A to 1, B to 2, etc.
      const col = parseInt(seatNumber.slice(1));
      return { row, col };
    });
    console.log("Occupied seats:", occupiedSeats.value);
  } catch (error) {
    console.error("Error fetching booked seats:", error);
  }
};

// Watch for changes in booking details to refetch occupied seats
watch(
  [
    () => bookingDetails.value?.theaterId,
    () => bookingDetails.value?.date,
    () => bookingDetails.value?.time,
  ],
  async (newValues, oldValues, onCleanup) => {
    // Only fetch if we have all required values and something changed
    if (
      newValues.every((value) => value) &&
      newValues.some((value, index) => value !== oldValues[index])
    ) {
      loading.value = true;
      try {
        await fetchBookedSeats();
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true }
);

const theaterName = computed(() => {
  const theaters = [
    { id: "1", name: "CGV Grand Indonesia" },
    { id: "2", name: "XXI Plaza Indonesia" },
    { id: "3", name: "AMC Empire 25" },
    { id: "4", name: "TCL Chinese Theatre" },
    { id: "5", name: "Odeon Luxe Leicester Square" },
    { id: "6", name: "TOHO Cinemas Shinjuku" },
    { id: "7", name: "CGV Yongsan I'Park Mall" },
    { id: "8", name: "Event Cinemas George Street" },
    { id: "9", name: "Shaw Theatres Lido IMAX" },
    { id: "10", name: "Reel Cinemas The Dubai Mall" },
  ];
  return (
    theaters.find((t) => t.id === bookingDetails.value?.theaterId)?.name || ""
  );
});

// Seat selection logic
const basePrice = bookingDetails.value.price || 100000; // Default price if not set
const vipPrice = basePrice * 1.5; // VIP seats cost 50% more
const VIP_SEAT_ROWS = [1, 2]; // First two rows (A and B) are VIP
const selectedSeats = ref<Array<{ row: number; col: number }>>([]);
const showConfirmDialog = ref(false);
const showSuccessDialog = ref(false);
const hoveredSeat = ref(null);

const isOccupied = (row: number, col: number) => {
  const seatExists = occupiedSeats.value.some(
    (seat) => seat.row === row && seat.col === col
  );
  return seatExists;
};

const isSelected = (row: number, col: number) => {
  return selectedSeats.value.some(
    (seat) => seat.row === row && seat.col === col
  );
};

const toggleSeat = (row: number, col: number) => {
  if (isOccupied(row, col)) {
    return; // Early return if seat is occupied
  }

  const seatIndex = selectedSeats.value.findIndex(
    (seat) => seat.row === row && seat.col === col
  );

  if (seatIndex === -1) {
    selectedSeats.value.push({ row, col });
  } else {
    selectedSeats.value.splice(seatIndex, 1);
  }
};

const selectedSeatsLabel = computed(() => {
  return (
    selectedSeats.value
      .map((seat) => `${String.fromCharCode(64 + seat.row)}${seat.col}`)
      .join(", ") || "None"
  );
});

const regularSeatsCount = computed(
  () =>
    selectedSeats.value.filter((seat) => !VIP_SEAT_ROWS.includes(seat.row))
      .length
);

const vipSeatsCount = computed(
  () =>
    selectedSeats.value.filter((seat) => VIP_SEAT_ROWS.includes(seat.row))
      .length
);

const totalPrice = computed(() => {
  return selectedSeats.value.reduce((total, seat) => {
    return total + (isVipSeat(seat.row, seat.col) ? vipPrice : basePrice);
  }, 0);
});

const formatDateTime = (date: string, time: string) => {
  if (!date || !time) return "";
  return moment(`${date} ${time}`)
    .locale("en")
    .format("dddd, MMMM D, YYYY [at] h:mm A");
};

const isVipSeat = (row: number, col: number) => {
  return VIP_SEAT_ROWS.includes(row);
};

const getSeatPrice = (row: number, col: number) => {
  return isVipSeat(row, col)
    ? `$ ${(basePrice * 1.5).toLocaleString("id-ID")}`
    : `$ ${basePrice.toLocaleString("id-ID")}`;
};

const handleSeatHover = (row: number, col: number) => {
  if (!isOccupied(row, col)) {
    hoveredSeat.value = { row, col };
  }
};

const formatSeatLabel = (seat: { row: number; col: number }) => {
  return `${String.fromCharCode(64 + seat.row)}${seat.col}`;
};

const confirmBooking = () => {
  showConfirmDialog.value = true;
};

const processBooking = async () => {
  try {
    loading.value = true;
    const formattedSeats = selectedSeats.value.map((seat) => {
      const isVIPSeat = isVipSeat(seat.row, seat.col);
      return {
        seatNumber: formatSeatLabel(seat),
        isVIP: isVIPSeat,
        price: isVIPSeat ? vipPrice : basePrice,
      };
    });

    await bookingApi.createBooking({
      movieId: bookingDetails.value.movieId,
      theaterId: bookingDetails.value.theaterId,
      posterUrl: movieDetails.value?.posterUrl || "",
      showDate: bookingDetails.value.date,
      showTime: bookingDetails.value.time,
      seats: formattedSeats,
      totalPrice: totalPrice.value,
    });

    // Clear stored booking data
    localStorage.removeItem("movieDetails");
    localStorage.removeItem("bookingDetails");

    // Show success dialog
    showConfirmDialog.value = false;
    showSuccessDialog.value = true;
  } catch (error) {
    console.error("Error creating booking:", error);
    alert(error.message || "Failed to create booking. Please try again.");
  } finally {
    loading.value = false;
  }
};

const formatPrice = (value: number) => {
  return value.toLocaleString("id-ID");
};
</script>

<style lang="scss" scoped>
.seat-selection-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  animation: slideUp 0.5s ease-out;
}

.movie-info-header {
  position: relative;
  overflow: hidden;
  background-color: var(--v-surface-variant);
}

.movie-info-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    var(--v-surface-variant),
    rgba(var(--v-surface-variant-rgb), 0.9)
  );
  backdrop-filter: blur(20px);
  z-index: 1;
}

.movie-info-content {
  position: relative;
  z-index: 2;
}

.movie-poster-col {
  margin-right: 32px;
  @media (max-width: 600px) {
    margin-right: 0;
    margin-bottom: 24px;
  }
}

.movie-poster {
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  }
}

.movie-details-col {
  @media (max-width: 600px) {
    text-align: center;

    .d-flex {
      justify-content: center;
    }

    .movie-info-meta {
      justify-content: center;
    }
  }
}

.movie-info-meta {
  .v-icon {
    opacity: 0.9;
  }
}

.booking-progress {
  margin-top: auto;
  padding-top: 24px;

  .booking-progress-bar {
    border-radius: 4px;
    overflow: hidden;
  }

  @media (max-width: 600px) {
    margin-top: 24px;
  }
}

.gap-2 {
  gap: 8px;
}

.screen-container {
  position: relative;
  perspective: 700px;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  transition: all 0.5s ease;
}

.screen {
  background: linear-gradient(45deg, #e0e0e0, #ffffff);
  height: 80px;
  transform: rotateX(35deg);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.5s ease;

  &:hover {
    transform: rotateX(40deg);
    box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.25);
  }
}

.screen-text {
  color: #757575;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 8px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.screen-shadow {
  position: absolute;
  top: -30px;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  transition: all 0.5s ease;
}

.seats-container {
  max-width: 900px;
  margin: 0 auto;
  overflow-x: auto;
  padding: 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--v-primary) transparent;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--v-primary);
    border-radius: 3px;
  }
}

.seat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  position: relative;
}

@for $i from 1 through 8 {
  .seat-row:nth-child(#{$i}) {
    animation-delay: #{$i * 0.1}s;
  }
}

.row-label {
  width: 35px;
  height: 35px;
  text-align: center;
  font-weight: 600;
  color: var(--v-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(var(--v-primary-rgb), 0.1);
}

.seat {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  background: linear-gradient(135deg, #4caf50, #43a047);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #43a047;
  will-change: transform;

  &:hover:not(.occupied) {
    transform: scale(1.15) translateY(-5px);
    box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3);
    z-index: 10;
  }

  &.occupied {
    background: linear-gradient(135deg, #ff5252, #ff1744) !important;
    cursor: not-allowed;
    border-color: #ff1744 !important;
    color: white !important;
    opacity: 0.9;
    transform: none !important;
    box-shadow: none !important;

    &:hover {
      transform: none !important;
      box-shadow: none !important;
    }

    &.vip {
      background: linear-gradient(135deg, #ff5252, #ff1744) !important;
      border-color: #ff1744 !important;
      color: white !important;
    }
  }

  &.selected {
    background: linear-gradient(135deg, #2196f3, #1976d2);
    border-color: #1976d2;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(33, 150, 243, 0.3);
  }

  &.vip {
    background: linear-gradient(135deg, #ffd700, #ffb700);
    color: #000;
    border: 2px solid #ffb700;

    &:hover:not(.occupied) {
      border-color: #ffa000;
      box-shadow: 0 8px 16px rgba(255, 183, 0, 0.3);
    }

    &.selected {
      background: linear-gradient(135deg, #f57c00, #ef6c00);
      border-color: #ef6c00;
      color: white;
      box-shadow: 0 6px 12px rgba(245, 124, 0, 0.3);
    }
  }
}

.seat-number {
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.seat-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  animation: fadeInUp 0.2s ease-out forwards;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.9);
  }
}

.seat-demo {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  margin-right: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &.regular {
    background: linear-gradient(135deg, #4caf50, #43a047);
    border: 2px solid #43a047;
  }

  &.vip {
    background: linear-gradient(135deg, #ffd700, #ffb700);
    border: 2px solid #ffb700;
  }

  &.occupied {
    background: linear-gradient(135deg, #ff5252, #ff1744);
    border: 2px solid #ff1744;
    opacity: 0.9;
  }
}

.booking-summary {
  background: linear-gradient(
    to right,
    var(--v-surface-variant),
    rgba(var(--v-surface-variant-rgb), 0.9)
  );
  backdrop-filter: blur(10px);
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-seats {
  min-height: 90px;
  transition: all 0.3s ease;
}

.confirmation-dialog,
.success-dialog {
  border-radius: 20px;
  overflow: hidden;
  animation: scaleIn 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
