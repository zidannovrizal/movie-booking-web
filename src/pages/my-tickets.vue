<template>
  <div class="my-tickets">
    <Navbar />

    <v-container class="py-8">
      <h1 class="text-h4 font-weight-bold mb-6">My Tickets</h1>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </div>

      <!-- Empty State -->
      <div v-else-if="!tickets.length" class="empty-state text-center py-12">
        <v-icon size="120" color="grey" class="mb-6"
          >mdi-ticket-confirmation-outline</v-icon
        >
        <h3 class="text-h5 font-weight-medium mb-3">No Tickets Found</h3>
        <p class="text-body-1 text-medium-emphasis mb-8 max-w-md mx-auto">
          Looks like you haven't booked any movies yet. Start exploring our
          latest movies and book your tickets now!
        </p>
        <v-btn
          color="primary"
          size="large"
          to="/movies"
          variant="flat"
          width="200"
        >
          Browse Movies
        </v-btn>
      </div>

      <!-- Tickets Grid -->
      <v-row v-else>
        <v-col
          v-for="ticket in formattedTickets"
          :key="ticket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <div
            class="ticket-wrapper"
            :class="{ expired: isExpired(ticket) }"
            @click="showTicketDetails(ticket)"
          >
            <div class="ticket">
              <!-- Main Ticket Content -->
              <div class="ticket-main">
                <div class="ticket-poster">
                  <v-img
                    :src="ticket.moviePoster"
                    :lazy-src="'/images/no-poster.png'"
                    height="100%"
                    width="100%"
                    cover
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </div>

                <div class="ticket-content">
                  <div class="ticket-header">
                    <div
                      class="d-flex justify-space-between align-center w-100"
                    >
                      <h3 class="text-h6 font-weight-bold text-truncate mb-0">
                        {{ ticket.movieTitle }}
                      </h3>
                      <div
                        class="status-chip"
                        :class="ticket.status.toLowerCase()"
                      >
                        {{ ticket.status }}
                      </div>
                    </div>
                  </div>

                  <div class="ticket-info">
                    <div class="info-row">
                      <span class="info-label card">CODE</span>
                      <span class="info-value card"
                        >#{{ ticket.id.slice(-8).toUpperCase() }}</span
                      >
                    </div>
                    <div class="info-row">
                      <span class="info-label card">DATE</span>
                      <span class="info-value card"
                        >{{ formatDateIndo(ticket.showDate) }} •
                        {{ ticket.showTime }}</span
                      >
                    </div>
                    <div class="info-row">
                      <span class="info-label card">VENUE</span>
                      <span class="info-value card">{{
                        ticket.theater.name
                      }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label card">SEAT</span>
                      <span class="info-value card">{{
                        ticket.seats.join(", ")
                      }}</span>
                    </div>
                  </div>

                  <div class="ticket-qr">
                    <img
                      :src="ticket.qrCode"
                      alt="Ticket QR Code"
                      class="qr-code"
                    />
                  </div>
                </div>
              </div>

              <!-- Ticket Footer -->
              <div class="ticket-footer">
                <div class="ticket-price">
                  <span class="text-primary font-weight-medium"
                    >$ {{ formatPrice(ticket.totalPrice) }}</span
                  >
                </div>
              </div>

              <!-- Decorative Elements -->
              <div class="ticket-tear-left"></div>
              <div class="ticket-tear-right"></div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Ticket Detail Dialog -->
    <v-dialog v-model="showDetailDialog" max-width="1000">
      <v-card v-if="selectedTicket" class="ticket-detail">
        <div class="d-flex">
          <!-- Left Section: Movie Poster -->
          <div class="poster-section">
            <v-img
              :src="selectedTicket.moviePoster"
              :lazy-src="'/images/no-poster.png'"
              height="100%"
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
          </div>

          <!-- Right Section: Ticket Details -->
          <div class="details-section">
            <!-- Header -->
            <div class="d-flex justify-space-between align-center pa-4">
              <div class="d-flex align-center">
                <h2 class="text-h5 font-weight-bold mb-0 mr-4">
                  {{ selectedTicket.movieTitle }}
                </h2>
                <div
                  class="status-badge"
                  :class="selectedTicket.status.toLowerCase()"
                >
                  {{ selectedTicket.status }}
                </div>
              </div>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                @click="showDetailDialog = false"
              ></v-btn>
            </div>

            <v-divider></v-divider>

            <!-- Main Content -->
            <div class="d-flex ticket-main pa-4">
              <!-- Left Column -->
              <div class="flex-grow-1 pr-4">
                <div class="theater-name mb-4 text-body-1">
                  {{ selectedTicket.theater.name }}
                </div>

                <div class="ticket-info-grid">
                  <div class="info-item">
                    <div>
                      <div class="info-label">Ticket Code</div>
                      <div class="info-value">
                        #{{ selectedTicket.id.slice(-8).toUpperCase() }}
                      </div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div>
                      <div class="info-label">Show Date</div>
                      <div class="info-value">
                        {{ formatDateIndo(selectedTicket.showDate) }}
                      </div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div>
                      <div class="info-label">Show Time</div>
                      <div class="info-value">
                        {{ selectedTicket.showTime }}
                      </div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div>
                      <div class="info-label">Seats</div>
                      <div class="info-value">
                        {{ selectedTicket.seats.join(", ") }}
                      </div>
                      <div class="info-sub">
                        {{
                          selectedTicket.isVIP ? "VIP Seats" : "Regular Seats"
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div>
                      <div class="info-label">Total Price</div>
                      <div class="info-value text-primary font-weight-bold">
                        $ {{ formatPrice(selectedTicket.totalPrice) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-2 mt-4 pb-4">
                  <v-btn
                    v-if="selectedTicket.status === 'PENDING'"
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-cash-refund"
                    @click="cancelBooking(selectedTicket.id)"
                    :loading="loading"
                  >
                    Request Refund
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-movie"
                    :to="`/movies/${selectedTicket.tmdbMovieId}`"
                  >
                    Movie Details
                  </v-btn>
                </div>
              </div>

              <!-- Right Column - QR Code -->
              <div class="qr-section">
                <div class="qr-container">
                  <img
                    :src="selectedTicket.qrCode"
                    alt="Ticket QR Code"
                    class="qr-code"
                  />
                  <div class="text-caption text-center mt-2">
                    Scan at theater entrance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>

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
import { ref, onMounted, computed } from "vue";
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
const showDetailDialog = ref(false);
const selectedTicket = ref(null);

// Modify the formattedTickets computed property to use posterUrl directly
const formattedTickets = computed(() => {
  return tickets.value.map((ticket) => ({
    ...ticket,
    moviePoster: ticket.posterUrl || "/images/no-poster.png",
  }));
});

const formatDate = (date: string) => {
  if (!date) return "";
  return moment(date).format("dddd, MMMM D, YYYY");
};

const formatTime = (time: string) => {
  return moment(time, "HH:mm").format("h:mm A");
};

const formatDuration = (minutes: number) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatPrice = (price: number) => {
  return price.toLocaleString("id-ID");
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

const generateQRCode = async (ticket: any) => {
  try {
    if (!ticket || !ticket.id) {
      console.warn("Invalid ticket data for QR code generation");
      return "";
    }

    const ticketData = {
      id: ticket.id,
      movieId: ticket.tmdbMovieId,
      theaterId: ticket.theaterId,
      seats: ticket.seats,
      showDate: ticket.showDate,
      showTime: ticket.showTime,
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

const cancelBooking = async (id: string) => {
  try {
    await bookingApi.cancelBooking(id);
    // Refresh the tickets list
    const response = await bookingApi.getUserBookings();
    tickets.value = response.data;

    // Regenerate QR codes
    tickets.value = await Promise.all(
      tickets.value.map(async (ticket) => ({
        ...ticket,
        qrCode: await generateQRCode(ticket),
      }))
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    showError.value = true;
  }
};

const showTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
  showDetailDialog.value = true;
};

const isExpired = (ticket) => {
  const showDateTime = moment(
    `${ticket.showDate} ${ticket.showTime}`,
    "YYYY-MM-DD HH:mm"
  );
  return moment().isAfter(showDateTime);
};

const formatDateIndo = (date: string) => {
  if (!date) return "";
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const d = new Date(date);
  const day = days[d.getDay()];
  const dateNum = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${dateNum} ${month} ${year}`;
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }

  try {
    loading.value = true;
    const response = await bookingApi.getUserBookings();
    tickets.value = response.data;

    // Generate QR codes
    tickets.value = await Promise.all(
      tickets.value.map(async (ticket) => ({
        ...ticket,
        qrCode: await generateQRCode(ticket),
      }))
    );
  } catch (error) {
    console.error("Error fetching tickets:", error);
    showError.value = true;
    errorMessage.value = "Failed to load tickets. Please try again.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.tickets-header {
  background: linear-gradient(
    to right,
    var(--v-primary-base),
    var(--v-primary-darken1)
  );
  margin: -2rem -1rem 2rem;
  padding: 3rem 1rem;
  border-radius: 0 0 30px 30px;
  color: white;
}

.empty-state {
  background: var(--v-surface-variant);
  border-radius: 24px;
  padding: 4rem 2rem;
}

.max-w-md {
  max-width: 28rem;
}

.ticket-wrapper {
  cursor: pointer;
  transition: all 0.3s ease;
  perspective: 1000px;

  &:hover {
    transform: translateY(-4px);

    .ticket {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }
  }

  &.expired {
    opacity: 0.7;
  }
}

.ticket {
  background: var(--v-surface-variant);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ticket-main {
  display: flex;
  min-height: 160px;
  position: relative;
}

.ticket-poster {
  width: 100px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
    background: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 8px,
      rgba(0, 0, 0, 0.05) 8px,
      rgba(0, 0, 0, 0.05) 16px
    );
  }
}

.ticket-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--v-surface);
}

.ticket-header {
  margin-bottom: 4px;
}

.status-chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.ticket-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--v-medium-emphasis);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 45px;

  &.card {
    color: var(--v-on-surface-variant);
  }
}

.info-value {
  font-size: 0.8rem;
  color: var(--v-high-emphasis);

  &.card {
    color: var(--v-on-surface);
  }
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.ticket-qr {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
}

.qr-code {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.ticket-footer {
  padding: 8px 12px;
  background: var(--v-surface-variant);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  font-size: 0.8rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
      to right,
      transparent,
      transparent 8px,
      rgba(128, 128, 128, 0.15) 8px,
      rgba(128, 128, 128, 0.15) 16px
    );
  }
}

.ticket-price {
  font-family: monospace;
  font-weight: 600;
  color: var(--v-primary-base);
}

.ticket-tear-left,
.ticket-tear-right {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: var(--v-background);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.ticket-tear-left {
  left: 0;
}

.ticket-tear-right {
  right: -10px;
}

@media (max-width: 600px) {
  .ticket-main {
    flex-direction: row;
  }

  .ticket-poster {
    width: 80px;
  }

  .qr-code {
    width: 50px;
    height: 50px;
  }

  .tickets-header {
    margin: -1rem -1rem 2rem;
    padding: 2rem 1rem;
  }
}

/* Revamped Detail Dialog Styles */
.ticket-detail {
  border-radius: 16px;
  overflow: hidden;
  background: rgb(var(--v-theme-surface));
}

.poster-section {
  width: 300px;
  position: relative;
  background: rgb(18, 18, 18);
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 4px;
    background: repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 8px,
      rgba(0, 0, 0, 0.05) 8px,
      rgba(0, 0, 0, 0.05) 16px
    );
  }
}

.details-section {
  flex: 1;
  min-width: 0;
  background: rgb(var(--v-theme-surface));
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.theater-name {
  font-weight: 500;
  color: var(--v-high-emphasis);
}

.ticket-main {
  height: 400px;
  overflow-y: auto;
}

.ticket-info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  padding: 12px;
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  font-weight: 500;
}

.info-sub {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 2px;
}

.qr-section {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 16px;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.qr-container {
  background: rgb(var(--v-theme-surface-variant));
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-code {
  width: 140px;
  height: 140px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.confirmed {
    background-color: rgba(76, 175, 80, 0.15);
    color: rgb(76, 175, 80);
  }

  &.pending {
    background-color: rgba(255, 193, 7, 0.15);
    color: rgb(255, 193, 7);
  }

  &.cancelled {
    background-color: rgba(244, 67, 54, 0.15);
    color: rgb(244, 67, 54);
  }
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 900px) {
  .poster-section {
    width: 200px;
  }

  .qr-section {
    width: 160px;
  }

  .qr-code {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 700px) {
  .poster-section {
    display: none;
  }
}
</style>
