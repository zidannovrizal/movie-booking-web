import api from "./config";
import type {
  Theater,
  CreateTheaterDto,
  UpdateTheaterDto,
  ShowTime,
} from "@/types";

export const theaterApi = {
  // Get all theaters
  getAllTheaters: async () => {
    const response = await api.get<Theater[]>("/theaters");
    return response.data;
  },

  // Get theater by id
  getTheaterById: async (id: string) => {
    const response = await api.get<Theater>(`/theaters/${id}`);
    return response.data;
  },

  // Get theaters by city
  getTheatersByCity: async (city: string) => {
    const response = await api.get<Theater[]>(
      `/theaters/city/${encodeURIComponent(city)}`
    );
    return response.data;
  },

  // Get theater showtimes
  getTheaterShowtimes: async (theaterId: string, date?: string) => {
    const url = date
      ? `/theaters/${theaterId}/showtimes?date=${encodeURIComponent(date)}`
      : `/theaters/${theaterId}/showtimes`;
    const response = await api.get<ShowTime[]>(url);
    return response.data;
  },

  // Create theater (admin only)
  createTheater: (theater: CreateTheaterDto) =>
    api.post<Theater>("/theaters", theater),

  // Update theater (admin only)
  updateTheater: (id: string, theater: UpdateTheaterDto) =>
    api.put<Theater>(`/theaters/${id}`, theater),

  // Delete theater (admin only)
  deleteTheater: (id: string) => api.delete(`/theaters/${id}`),
};
