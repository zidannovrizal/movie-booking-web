import api from "./config";
import type { Booking } from "@/types";

interface CreateBookingDto {
  movieId: number;
  theaterId: string;
  posterUrl: string;
  showDate: string;
  showTime: string;
  seats: Array<{
    seatNumber: string;
    isVIP: boolean;
    price: number;
  }>;
  totalPrice: number;
}

export const bookingApi = {
  // Get user's bookings
  getUserBookings: () => api.get<Booking[]>("/api/bookings/user"),

  // Create a new booking
  createBooking: (data: CreateBookingDto) =>
    api.post<Booking>("/api/bookings", data),

  // Get booking by id
  getBookingById: (id: string) => api.get<Booking>(`/api/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id: string) => api.delete(`/api/bookings/${id}`),

  // Get booked seats for a theater, date and time
  getBookedSeats: (theaterId: string, date: string, time: string) =>
    api.get<string[]>(`/api/bookings/seats/${theaterId}/${date}/${time}`),
};
