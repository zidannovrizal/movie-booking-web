import api from "./config";
import type { Booking, BookingStatus } from "@/types";

interface CreateBookingDto {
  showTimeId: string;
  seats: string[];
}

export const bookingApi = {
  // Get user's tickets
  getMyTickets: () => api.get<Booking[]>("/bookings/my-tickets"),

  // Get user's bookings
  getUserBookings: () => api.get<Booking[]>("/bookings/user"),

  // Create a new booking
  createBooking: (data: CreateBookingDto) =>
    api.post<Booking>("/bookings", data),

  // Get booking by id
  getBookingById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id: string) => api.delete<Booking>(`/bookings/${id}`),

  // Get all bookings (admin only)
  getAllBookings: () => api.get<Booking[]>("/bookings"),

  // Update booking status (admin only)
  updateBookingStatus: (id: string, status: BookingStatus) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }),
};
