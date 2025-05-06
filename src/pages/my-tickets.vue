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
                      <span class="info-label">TIX</span>
                      <span class="info-value"
                        >#{{ ticket.id.slice(-8).toUpperCase() }}</span
                      >
                    </div>
                    <div class="info-row">
                      <span class="info-label">DATE</span>
                      <span class="info-value"
                        >{{ formatDateIndo(ticket.showDate) }} •
                        {{ ticket.showTime }}</span
                      >
                    </div>
                    <div class="info-row">
                      <span class="info-label">VENUE</span>
                      <span class="info-value text-truncate">{{
                        ticket.theater.name
                      }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">SEAT</span>
                      <span class="info-value">{{
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
                    >Rp {{ formatPrice(ticket.totalPrice) }}</span
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
    <v-dialog v-model="showDetailDialog" max-width="400">
      <v-card v-if="selectedTicket" class="ticket-detail">
        <!-- Header -->
        <div class="detail-header pa-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <div
              class="status-badge"
              :class="selectedTicket.status.toLowerCase()"
            >
              {{ selectedTicket.status }}
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="showDetailDialog = false"
            ></v-btn>
          </div>

          <div class="d-flex align-start gap-3">
            <v-img
              :src="selectedTicket.moviePoster"
              width="100"
              aspect-ratio="2/3"
              cover
              class="rounded-lg"
            ></v-img>
            <div class="flex-grow-1">
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ selectedTicket.movieTitle }}
              </h2>
              <div class="text-medium-emphasis">
                {{ selectedTicket.theater.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Details -->
        <div class="detail-content">
          <div class="detail-section">
            <div class="detail-row">
              <span class="detail-label">TIX</span>
              <span class="detail-value"
                >#{{ selectedTicket.id.slice(-8).toUpperCase() }}</span
              >
            </div>
            <div class="detail-row">
              <span class="detail-label">DATE</span>
              <span class="detail-value">{{
                formatDateIndo(selectedTicket.showDate)
              }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">TIME</span>
              <span class="detail-value">{{ selectedTicket.showTime }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">SEAT</span>
              <div>
                <div class="detail-value">
                  {{ selectedTicket.seats.join(", ") }}
                </div>
                <div class="detail-sub">
                  {{ selectedTicket.isVIP ? "VIP Seats" : "Regular Seats" }}
                </div>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">TOTAL</span>
              <span class="detail-value text-primary font-weight-bold">
                Rp {{ formatPrice(selectedTicket.totalPrice) }}
              </span>
            </div>
          </div>

          <!-- QR Code -->
          <div class="qr-section">
            <img
              :src="selectedTicket.qrCode"
              alt="Ticket QR Code"
              class="detail-qr-code"
            />
            <div class="text-caption text-center mt-2">
              Scan at theater entrance
            </div>
          </div>
        </div>

        <!-- Actions -->
        <v-card-actions class="pa-4">
          <div class="d-flex flex-column w-100 gap-2">
            <v-btn
              v-if="selectedTicket.status === 'PENDING'"
              class="mb-2"
              color="error"
              variant="outlined"
              block
              prepend-icon="mdi-cash-refund"
              @click="cancelBooking(selectedTicket.id)"
              :loading="loading"
            >
              Request Refund
            </v-btn>
            <v-btn
              color="primary"
              variant="flat"
              block
              prepend-icon="mdi-movie"
              :to="`/movies/${selectedTicket.tmdbMovieId}`"
            >
              Movie Details
            </v-btn>
          </div>
        </v-card-actions>
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
}

.info-value {
  font-size: 0.8rem;
  color: var(--v-high-emphasis);
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

/* Enhanced Detail Dialog Styles */
.ticket-detail {
  border-radius: 12px;
  overflow: hidden;
}

.detail-header {
  background: var(--v-surface);
  border-bottom: 1px solid var(--v-border-color);
}

.detail-content {
  padding: 16px;
  background: var(--v-surface);
}

.detail-section {
  background: var(--v-surface-variant);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(var(--v-border-opacity), 0.12);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--v-medium-emphasis);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 45px;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--v-high-emphasis);
}

.detail-sub {
  font-size: 0.75rem;
  color: var(--v-medium-emphasis);
  margin-top: 2px;
}

.qr-section {
  margin-top: 16px;
  padding: 16px;
  background: var(--v-surface-variant);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-qr-code {
  width: 140px;
  height: 140px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  object-fit: contain;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.confirmed {
    background-color: rgb(76, 175, 80, 0.15);
    color: rgb(76, 175, 80);
  }

  &.pending {
    background-color: rgb(255, 193, 7, 0.15);
    color: rgb(255, 193, 7);
  }

  &.cancelled {
    background-color: rgb(244, 67, 54, 0.15);
    color: rgb(244, 67, 54);
  }
}
</style>
