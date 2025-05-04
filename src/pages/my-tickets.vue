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
        <v-col
          v-for="ticket in tickets"
          :key="ticket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="ticket-card">
            <div
              class="ticket-header"
              :style="{ backgroundImage: `url(${ticket.movie.backdropUrl})` }"
            >
              <div class="ticket-overlay">
                <v-img
                  :src="ticket.movie.posterUrl"
                  width="80"
                  height="120"
                  cover
                  class="ticket-poster"
                ></v-img>
                <div class="ticket-header-content">
                  <h3 class="text-h6 font-weight-bold text-white mb-1">
                    {{ ticket.movie.title }}
                  </h3>
                  <p class="text-body-2 text-white-darken-2">
                    {{ ticket.movie.genres }}
                  </p>
                </div>
              </div>
            </div>

            <v-divider class="ticket-divider">
              <v-icon>mdi-circle-small</v-icon>
              <v-icon>mdi-circle-small</v-icon>
              <v-icon>mdi-circle-small</v-icon>
            </v-divider>

            <v-card-text class="ticket-details pa-4">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-theater</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ ticket.showTime.theater.name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDate(ticket.showTime.date) }}
                  </div>
                </div>
              </div>

              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ formatTime(ticket.showTime.startTime) }}
                  </div>
                  <div class="text-caption text-medium-emphasis">Show Time</div>
                </div>
              </div>

              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-seat</v-icon>
                <div>
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ ticket.seats.join(", ") }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Seat Number
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0">
              <v-btn
                color="primary"
                variant="tonal"
                block
                :to="`/movies/${ticket.movie.id}`"
              >
                Movie Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { bookingApi } from "@/api/bookings";
import moment from "moment";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const tickets = ref([]);

const formatDate = (date: string) => {
  return moment(date).format("dddd, MMMM D, YYYY");
};

const formatTime = (time: string) => {
  return moment(time, "HH:mm").format("h:mm A");
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/auth/login");
    return;
  }

  try {
    const response = await bookingApi.getMyTickets();
    tickets.value = response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
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

  &:hover {
    transform: translateY(-4px);
  }
}

.ticket-header {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.ticket-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.8)
  );
  padding: 16px;
  display: flex;
  align-items: flex-end;
}

.ticket-poster {
  border-radius: 8px;
  margin-right: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.ticket-header-content {
  flex: 1;
}

.ticket-divider {
  position: relative;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--v-surface-variant);

  .v-icon {
    color: var(--v-surface);
  }
}

.ticket-details {
  background-color: var(--v-surface-variant);
}
</style>
