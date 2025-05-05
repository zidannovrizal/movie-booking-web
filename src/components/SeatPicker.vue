<template>
  <div class="seat-picker">
    <v-card class="pa-4">
      <div class="text-center mb-8">
        <div class="screen mb-8">
          <div class="screen-box">
            <span class="text-caption">SCREEN</span>
          </div>
        </div>

        <div class="d-flex align-center justify-center gap-4 mb-4">
          <div class="d-flex align-center">
            <v-btn
              size="small"
              variant="tonal"
              color="grey"
              class="mr-2"
              disabled
            ></v-btn>
            <span class="text-caption">Available</span>
          </div>
          <div class="d-flex align-center">
            <v-btn
              size="small"
              variant="tonal"
              color="primary"
              class="mr-2"
              disabled
            ></v-btn>
            <span class="text-caption">Selected</span>
          </div>
          <div class="d-flex align-center">
            <v-btn
              size="small"
              variant="tonal"
              color="error"
              class="mr-2"
              disabled
            ></v-btn>
            <span class="text-caption">Booked</span>
          </div>
        </div>
      </div>

      <div class="seats-container">
        <div
          v-for="row in rows"
          :key="row"
          class="d-flex align-center justify-center mb-2"
        >
          <div class="row-label mr-4">{{ row }}</div>
          <div class="d-flex gap-2">
            <v-btn
              v-for="col in columns"
              :key="col"
              size="small"
              variant="tonal"
              :color="getSeatColor(row + col)"
              :disabled="isBooked(row + col)"
              @click="toggleSeat(row + col)"
            >
              {{ col }}
            </v-btn>
          </div>
          <div class="row-label ml-4">{{ row }}</div>
        </div>
      </div>

      <v-divider class="my-4"></v-divider>

      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h6">Selected Seats:</div>
          <div class="text-body-1">
            {{ selectedSeats.join(", ") || "None" }}
          </div>
        </div>
        <div>
          <div class="text-h6">Total Price:</div>
          <div class="text-h5">Rp {{ formatPrice(totalPrice) }}</div>
        </div>
      </div>

      <v-btn
        block
        color="primary"
        size="large"
        class="mt-4"
        :disabled="selectedSeats.length === 0"
        @click="confirmBooking"
      >
        Confirm Booking
      </v-btn>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  price: number;
  bookedSeats?: string[];
}>();

const emit = defineEmits<{
  (e: "confirm", seats: string[]): void;
}>();

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const columns = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const selectedSeats = ref<string[]>([]);

const isBooked = (seatId: string) => {
  return props.bookedSeats?.includes(seatId) || false;
};

const getSeatColor = (seatId: string) => {
  if (isBooked(seatId)) return "error";
  if (selectedSeats.value.includes(seatId)) return "primary";
  return "grey";
};

const toggleSeat = (seatId: string) => {
  if (isBooked(seatId)) return;

  const index = selectedSeats.value.indexOf(seatId);
  if (index === -1) {
    selectedSeats.value.push(seatId);
  } else {
    selectedSeats.value.splice(index, 1);
  }
  selectedSeats.value.sort();
};

const totalPrice = computed(() => {
  return selectedSeats.value.length * props.price;
});

const formatPrice = (price: number) => {
  return price.toLocaleString("id-ID");
};

const confirmBooking = () => {
  emit("confirm", selectedSeats.value);
};
</script>

<style scoped>
.seat-picker {
  max-width: 800px;
  margin: 0 auto;
}

.screen {
  position: relative;
  width: 100%;
  perspective: 100px;
}

.screen-box {
  background: #ccc;
  height: 40px;
  width: 100%;
  transform: rotateX(-30deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.seats-container {
  max-width: 600px;
  margin: 0 auto;
}

.row-label {
  min-width: 20px;
  text-align: center;
  font-weight: bold;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}
</style>
