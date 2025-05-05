<template>
  <div class="seat-selection">
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="9">
          <v-card class="seat-selection-card">
            <!-- Movie Info Header -->
            <div class="movie-info-header pa-6">
              <v-row align="center">
                <v-col cols="12" sm="3">
                  <v-img
                    :src="movieDetails?.posterUrl || '/images/no-poster.png'"
                    :aspect-ratio="2 / 3"
                    cover
                    class="movie-poster rounded-lg"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="9">
                  <h2 class="text-h4 font-weight-bold mb-2">
                    {{ movieDetails?.title }}
                  </h2>
                  <div class="d-flex align-center flex-wrap mb-2">
                    <v-chip
                      v-for="genre in movieDetails?.genres?.split(',')"
                      :key="genre"
                      color="primary"
                      variant="flat"
                      size="small"
                      class="mr-2 mb-2"
                    >
                      {{ genre.trim() }}
                    </v-chip>
                  </div>
                  <div class="text-body-1 text-medium-emphasis mb-1">
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    {{
                      formatDateTime(bookingDetails?.date, bookingDetails?.time)
                    }}
                  </div>
                  <div class="text-body-1 text-medium-emphasis">
                    <v-icon size="small" class="mr-1">mdi-theater</v-icon>
                    {{ theaterName }}
                  </div>
                </v-col>
              </v-row>
            </div>

            <v-divider></v-divider>

            <!-- Seat Selection Area -->
            <div class="seat-selection-area pa-6">
              <!-- Screen -->
              <div class="screen-container mb-12">
                <div class="screen">
                  <span class="screen-text">SCREEN</span>
                </div>
                <div class="screen-shadow"></div>
              </div>

              <!-- Seat Legend -->
              <div
                class="d-flex justify-center align-center mb-8 flex-wrap gap-6"
              >
                <div class="d-flex align-center">
                  <div class="seat-demo available"></div>
                  <span class="ml-2 text-body-2">Available</span>
                </div>
                <div class="d-flex align-center">
                  <div class="seat-demo selected"></div>
                  <span class="ml-2 text-body-2">Selected</span>
                </div>
                <div class="d-flex align-center">
                  <div class="seat-demo occupied"></div>
                  <span class="ml-2 text-body-2">Occupied</span>
                </div>
                <div class="d-flex align-center">
                  <div class="seat-demo vip"></div>
                  <span class="ml-2 text-body-2">VIP (+$2)</span>
                </div>
              </div>

              <!-- Seats Grid -->
              <div class="seats-container mb-8">
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
            </div>

            <!-- Booking Summary -->
            <v-divider></v-divider>
            <div class="booking-summary pa-6">
              <v-row>
                <v-col cols="12" md="8">
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
                  <div class="price-breakdown">
                    <div class="d-flex justify-space-between mb-2">
                      <span>Regular Seats ({{ regularSeatsCount }})</span>
                      <span
                        >${{
                          (regularSeatsCount * PRICE_PER_SEAT).toFixed(2)
                        }}</span
                      >
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <span>VIP Seats ({{ vipSeatsCount }})</span>
                      <span
                        >${{
                          (vipSeatsCount * (PRICE_PER_SEAT + 2)).toFixed(2)
                        }}</span
                      >
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <div class="d-flex justify-space-between">
                      <span class="text-h6">Total</span>
                      <span class="text-h6">${{ totalPrice.toFixed(2) }}</span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="d-flex align-center">
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
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <v-icon size="64" color="primary">mdi-ticket-confirmation</v-icon>
          </div>
          <h3 class="text-h5 text-center mb-4">Confirm Your Booking</h3>
          <div class="text-body-1 mb-2">
            <strong>Movie:</strong> {{ movieDetails?.title }}
          </div>
          <div class="text-body-1 mb-2">
            <strong>Date & Time:</strong>
            {{ formatDateTime(bookingDetails?.date, bookingDetails?.time) }}
          </div>
          <div class="text-body-1 mb-2">
            <strong>Theater:</strong> {{ theaterName }}
          </div>
          <div class="text-body-1 mb-2">
            <strong>Seats:</strong> {{ selectedSeatsLabel }}
          </div>
          <div class="text-body-1 mb-4">
            <strong>Total Price:</strong> ${{ totalPrice.toFixed(2) }}
          </div>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-btn
            color="grey"
            variant="text"
            block
            class="mr-2"
            @click="showConfirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            block
            :loading="loading"
            @click="processBooking"
          >
            Confirm & Pay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import { bookingApi } from "@/api/bookings";

const route = useRoute();
const router = useRouter();
const loading = ref(false);

// Mock data - In real app, these would come from route params/query or store
const movieDetails = ref(
  JSON.parse(localStorage.getItem("movieDetails") || "{}")
);
const bookingDetails = ref(
  JSON.parse(localStorage.getItem("bookingDetails") || "{}")
);
const theaterName = computed(() => {
  const theaters = [
    { id: 1, name: "Cineplex Downtown" },
    { id: 2, name: "IMAX City Center" },
    { id: 3, name: "MovieMax Mall" },
  ];
  return (
    theaters.find((t) => t.id === bookingDetails.value?.theaterId)?.name || ""
  );
});

// Seat selection logic
const PRICE_PER_SEAT = 9.99;
const VIP_SEAT_ROWS = [1, 2]; // First two rows are VIP
const selectedSeats = ref<Array<{ row: number; col: number }>>([]);
const showConfirmDialog = ref(false);
const hoveredSeat = ref(null);

// Mock occupied seats - In real app, this would come from API
const occupiedSeats = [
  { row: 3, col: 5 },
  { row: 3, col: 6 },
  { row: 4, col: 7 },
  { row: 4, col: 8 },
];

const isOccupied = (row: number, col: number) => {
  return occupiedSeats.some((seat) => seat.row === row && seat.col === col);
};

const isSelected = (row: number, col: number) => {
  return selectedSeats.value.some(
    (seat) => seat.row === row && seat.col === col
  );
};

const toggleSeat = (row: number, col: number) => {
  if (isOccupied(row, col)) return;

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
  const regularPrice = regularSeatsCount.value * PRICE_PER_SEAT;
  const vipPrice = vipSeatsCount.value * (PRICE_PER_SEAT + 2);
  return regularPrice + vipPrice;
});

const formatDateTime = (date: string, time: string) => {
  if (!date || !time) return "";
  return moment(`${date} ${time}`).format("MMMM D, YYYY [at] h:mm A");
};

const isVipSeat = (row: number, col: number) => {
  return VIP_SEAT_ROWS.includes(row);
};

const getSeatPrice = (row: number, col: number) => {
  return isVipSeat(row, col)
    ? `$${(PRICE_PER_SEAT + 2).toFixed(2)}`
    : `$${PRICE_PER_SEAT.toFixed(2)}`;
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
    const formattedSeats = selectedSeats.value.map(
      (seat) => `${String.fromCharCode(64 + seat.row)}${seat.col}`
    );

    await bookingApi.createBooking({
      showTimeId: bookingDetails.value?.showTimeId,
      seats: formattedSeats,
    });

    localStorage.removeItem("movieDetails");
    localStorage.removeItem("bookingDetails");
    router.push("/my-tickets");
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage =
      error.response?.data?.error ||
      "Failed to create booking. Please try again.";
    alert(errorMessage);
  } finally {
    loading.value = false;
    showConfirmDialog.value = false;
  }
};
</script>

<style scoped>
.seat-selection-card {
  border-radius: 16px;
  overflow: hidden;
}

.movie-info-header {
  background-color: var(--v-surface-variant);
}

.movie-poster {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.screen-container {
  position: relative;
  perspective: 500px;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
}

.screen {
  background: linear-gradient(45deg, #e0e0e0, #ffffff);
  height: 60px;
  transform: rotateX(-30deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.screen-text {
  color: #9e9e9e;
  font-size: 0.8rem;
  letter-spacing: 4px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.screen-shadow {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
}

.seats-container {
  max-width: 800px;
  margin: 0 auto;
  overflow-x: auto;
}

.seat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.row-label {
  width: 30px;
  text-align: center;
  font-weight: 500;
  color: var(--v-medium-emphasis);
}

.seat {
  width: 35px;
  height: 35px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  background-color: var(--v-surface-variant);
  transition: all 0.2s ease;

  &:hover:not(.occupied) {
    transform: scale(1.1);
  }

  &.occupied {
    background-color: var(--v-disabled);
    cursor: not-allowed;
  }

  &.selected {
    background-color: var(--v-primary);
    color: white;
  }

  &.vip {
    background-color: #ffd700;
    color: #000;

    &.selected {
      background-color: var(--v-primary);
      color: white;
    }
  }
}

.seat-number {
  font-size: 0.8rem;
  font-weight: 500;
}

.seat-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.seat-demo {
  width: 25px;
  height: 25px;
  border-radius: 6px;
  margin-right: 8px;

  &.available {
    background-color: var(--v-surface-variant);
  }

  &.selected {
    background-color: var(--v-primary);
  }

  &.occupied {
    background-color: var(--v-disabled);
  }

  &.vip {
    background-color: #ffd700;
  }
}

.booking-summary {
  background-color: var(--v-surface-variant);
}

.selected-seats {
  min-height: 80px;
}

.gap-2 {
  gap: 8px;
}

.gap-6 {
  gap: 24px;
}
</style>
