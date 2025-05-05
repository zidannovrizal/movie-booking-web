<template>
  <div class="my-tickets">
    <Navbar />

    <v-container class="py-8">
      <h1 class="text-h4 font-weight-bold mb-6">My Tickets</h1>

      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <div v-else-if="tickets.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey" class="mb-4">mdi-ticket-outline</v-icon>
        <h3 class="text-h5 font-weight-medium mb-2">No Tickets Found</h3>
        <p class="text-body-1 text-medium-emphasis mb-6">
          You haven't booked any movies yet.
        </p>
        <v-btn color="primary" to="/" variant="flat"> Browse Movies </v-btn>
      </div>

      <v-row v-else>
        <v-col v-for="ticket in tickets" :key="ticket.id" cols="12" md="6">
          <v-card class="ticket-card">
            <!-- Movie Info -->
            <div class="ticket-header">
              <v-img
                :src="ticket.movie?.backdropUrl || '/images/no-backdrop.jpg'"
                height="200"
                cover
                class="ticket-backdrop"
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
              <div class="ticket-overlay">
                <div class="d-flex">
                  <v-img
                    :src="ticket.movie?.posterUrl || '/images/no-poster.png'"
                    width="100"
                    height="150"
                    cover
                    class="ticket-poster"
                  ></v-img>
                  <div class="ticket-header-content ml-4">
                    <h3 class="text-h5 font-weight-bold text-white mb-2">
                      {{ ticket.movie?.title || "Unknown Movie" }}
                    </h3>
                    <div class="d-flex align-center flex-wrap mb-2">
                      <v-chip
                        v-for="genre in ticket.movie?.genres?.split(',')"
                        :key="genre"
                        color="primary"
                        variant="flat"
                        size="x-small"
                        class="mr-2 mb-2"
                      >
                        {{ genre.trim() }}
                      </v-chip>
                    </div>
                    <div class="text-body-2 text-white-darken-2">
                      {{ ticket.movie?.runtime }} minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="ticket-divider">
              <v-icon>mdi-circle-small</v-icon>
              <v-icon>mdi-circle-small</v-icon>
              <v-icon>mdi-circle-small</v-icon>
            </v-divider>

            <!-- Ticket Details -->
            <div class="ticket-details pa-6">
              <div class="d-flex mb-6">
                <!-- Left Column -->
                <div class="flex-grow-1">
                  <div class="mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">
                      Theater
                    </div>
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="small" class="mr-2"
                        >mdi-theater</v-icon
                      >
                      <div class="text-subtitle-1 font-weight-medium">
                        {{ ticket.showTime.theater.name }}
                      </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">
                      Date & Time
                    </div>
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="small" class="mr-2"
                        >mdi-calendar</v-icon
                      >
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">
                          {{ formatDate(ticket.showTime.startTime) }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatTime(ticket.showTime.startTime) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="text-caption text-medium-emphasis mb-1">
                      Seats
                    </div>
                    <div class="d-flex align-center">
                      <v-icon color="primary" size="small" class="mr-2"
                        >mdi-seat</v-icon
                      >
                      <div class="text-subtitle-1 font-weight-medium">
                        {{ ticket.seats.join(", ") }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right Column (QR Code) -->
                <div class="ticket-qr ml-4">
                  <img
                    :src="ticket.qrCode"
                    alt="Ticket QR Code"
                    class="qr-code"
                  />
                  <div class="text-caption text-center mt-2">
                    #{{ ticket.id.slice(-8).toUpperCase() }}
                  </div>
                </div>
              </div>

              <!-- Ticket Status -->
              <div class="d-flex align-center justify-space-between">
                <v-chip
                  :color="getStatusColor(ticket.status)"
                  size="small"
                  class="text-uppercase"
                >
                  {{ ticket.status }}
                </v-chip>
                <v-btn
                  color="primary"
                  variant="text"
                  density="comfortable"
                  :to="`/movies/${ticket.showTime.tmdbMovieId}`"
                >
                  Movie Details
                  <v-icon size="small" class="ml-1">mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showError" color="error" timeout="5000" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { bookingApi } from "@/api/bookings";
import { movieApi } from "@/api/movies";
import moment from "moment";
import Navbar from "@/components/Navbar.vue";
import QRCode from "qrcode";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const tickets = ref([]);
const showError = ref(false);
const errorMessage = ref("");

const formatDate = (date: string) => {
  return moment(date).format("dddd, MMMM D, YYYY");
};

const formatTime = (time: string) => {
  return moment(time, "HH:mm").format("h:mm A");
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "grey";
  }
};

// Generate QR code for each ticket
const generateQRCode = async (ticket: any) => {
  try {
    const ticketData = {
      id: ticket.id,
      movieId: ticket.showTime.tmdbMovieId,
      theaterId: ticket.showTime.theater.id,
      seats: ticket.seats,
      showTime: ticket.showTime.startTime,
    };

    return await QRCode.toDataURL(JSON.stringify(ticketData), {
      width: 128,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }

  try {
    loading.value = true;
    const { data: bookings } = await bookingApi.getUserBookings();

    // Fetch movie details and generate QR codes for each booking
    const bookingsWithMovies = await Promise.all(
      bookings.map(async (booking) => {
        const [movieData, qrCode] = await Promise.all([
          movieApi.getMovieById(booking.showTime.tmdbMovieId),
          generateQRCode(booking),
        ]);

        return {
          ...booking,
          movie: movieData,
          qrCode,
        };
      })
    );

    tickets.value = bookingsWithMovies;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    errorMessage.value =
      error.response?.data?.error ||
      "Failed to fetch tickets. Please try again later.";
    showError.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.ticket-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s;
  background-color: var(--v-surface-variant);

  &:hover {
    transform: translateY(-4px);
  }
}

.ticket-header {
  position: relative;
}

.ticket-backdrop {
  filter: brightness(0.7);
}

.ticket-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.ticket-poster {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.ticket-divider {
  position: relative;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .v-icon {
    color: var(--v-surface);
  }
}

.ticket-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: white;
  border-radius: 8px;
  min-width: 144px;
}

.qr-code {
  width: 128px;
  height: 128px;
  object-fit: contain;
}

@media (max-width: 600px) {
  .ticket-overlay {
    padding: 16px;
  }

  .ticket-poster {
    width: 80px;
    height: 120px;
  }

  .ticket-qr {
    min-width: 112px;
  }

  .qr-code {
    width: 96px;
    height: 96px;
  }
}
</style>
