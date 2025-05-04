import api from "./config";
import type { Theater, CreateTheaterDto, UpdateTheaterDto } from "@/types";

export const theaterApi = {
  // Get all theaters
  getAllTheaters: () => api.get<Theater[]>("/theaters"),

  // Get theater by id
  getTheaterById: (id: string) => api.get<Theater>(`/theaters/${id}`),

  // Get theaters by city
  getTheatersByCity: (city: string) =>
    api.get<Theater[]>(`/theaters/city/${city}`),

  // Get theater showtimes
  getTheaterShowtimes: (id: string, date?: string) =>
    api.get<Theater>(`/theaters/${id}/showtimes`, { params: { date } }),

  // Create theater (admin only)
  createTheater: (theater: CreateTheaterDto) =>
    api.post<Theater>("/theaters", theater),

  // Update theater (admin only)
  updateTheater: (id: string, theater: UpdateTheaterDto) =>
    api.put<Theater>(`/theaters/${id}`, theater),

  // Delete theater (admin only)
  deleteTheater: (id: string) => api.delete(`/theaters/${id}`),
};
