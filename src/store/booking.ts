import { defineStore } from "pinia";
import api from "@/api/config";

interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  showTime: {
    id: string;
    startTime: string;
    price: number;
    theater: {
      id: string;
      name: string;
      city: string;
    };
    movie: {
      id: number;
      title: string;
      posterPath: string;
    };
  };
}

interface CreateBookingPayload {
  showTimeId: string;
  seats: string[];
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

export const useBookingStore = defineStore("booking", {
  state: (): BookingState => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createBooking(payload: CreateBookingPayload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<Booking>("/bookings", payload);
        this.currentBooking = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to create booking";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getBooking(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get<Booking>(`/bookings/${id}`);
        this.currentBooking = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to fetch booking";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getUserBookings() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get<Booking[]>("/bookings/user");
        this.bookings = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to fetch bookings";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async cancelBooking(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put<Booking>(`/bookings/${id}/cancel`);
        this.currentBooking = data;

        // Update bookings list if it exists
        const index = this.bookings.findIndex((b) => b.id === id);
        if (index !== -1) {
          this.bookings[index] = data;
        }

        return data;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to cancel booking";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
