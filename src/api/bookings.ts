import api from "./config";
import type { Booking, BookingStatus } from "@/types";

interface CreateBookingDto {
  showTimeId: string;
  seats: string[];
}

export const bookingApi = {
  // Create new booking
  createBooking: (booking: CreateBookingDto) =>
    api.post<Booking>("/bookings", booking),

  // Get user's bookings
  getUserBookings: () => api.get<Booking[]>("/bookings/my-bookings"),

  // Get booking by id
  getBookingById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id: string) => api.put<Booking>(`/bookings/${id}/cancel`),

  // Get all bookings (admin only)
  getAllBookings: () => api.get<Booking[]>("/bookings/all"),

  // Update booking status (admin only)
  updateBookingStatus: (id: string, status: BookingStatus) =>
    api.put<Booking>(`/bookings/${id}/status`, { status }),
};
