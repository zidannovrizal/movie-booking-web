import api from "./config";
import type { Booking } from "@/types";

interface BookingParams {
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

interface GetBookedSeatsParams {
  theaterId: string;
  showDate: string;
  showTime: string;
  movieId: number;
}

export const bookingApi = {
  // Get user's bookings
  getUserBookings: () => api.get<Booking[]>("/api/bookings/user"),

  // Create a new booking
  createBooking: (params: BookingParams) => {
    return api.post<Booking>("/api/bookings", params);
  },

  // Get booking by id
  getBookingById: (id: string) => api.get<Booking>(`/api/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id: string) => api.delete(`/api/bookings/${id}`),

  // Get booked seats for a theater, date and time
  getBookedSeats: (params: GetBookedSeatsParams) => {
    return api.get<string[]>(
      `/api/bookings/seats/${params.theaterId}/${params.showDate}/${params.showTime}`
    );
  },
};
