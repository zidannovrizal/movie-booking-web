import api from "./config";
import type { Booking, BookingStatus } from "@/types";

interface CreateBookingDto {
  showTimeId: string;
  seats: string[];
}

export const bookingApi = {
  // Get user's tickets
  getMyTickets: () => api.get<Booking[]>("/bookings/my-tickets"),

  // Create a new booking
  createBooking: (data: {
    movieId: number;
    showTimeId: number;
    seats: string[];
  }) => api.post<Booking>("/bookings", data),

  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get<Booking[]>("/bookings/my-bookings");
    return response.data;
  },

  // Get booking by id
  getBookingById: async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await api.delete<Booking>(`/bookings/${id}`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: () => api.get<Booking[]>("/bookings/all"),

  // Update booking status (admin only)
  updateBookingStatus: (id: string, status: BookingStatus) =>
    api.put<Booking>(`/bookings/${id}/status`, { status }),
};
