export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum MovieStatus {
  NOW_SHOWING = "NOW_SHOWING",
  COMING_SOON = "COMING_SOON",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  genre: string;
  releaseDate: Date;
  status: MovieStatus;
  posterUrl: string;
  trailerUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShowTime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  movie: Movie;
  theater: Theater;
}

export interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  showTime: ShowTime;
  user: User;
}

export interface CreateMovieDto {
  title: string;
  synopsis: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate: Date;
  status: MovieStatus;
  posterUrl: string;
  trailerUrl?: string;
  cast: string[];
  director: string;
  genre: string[];
  language?: string;
  subtitles: string[];
}

export interface UpdateMovieDto {
  title?: string;
  description?: string;
  duration?: number;
  genre?: string;
  releaseDate?: Date;
  status?: MovieStatus;
  posterUrl?: string;
  trailerUrl?: string;
}

export interface CreateTheaterDto {
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
}

export interface UpdateTheaterDto {
  name?: string;
  location?: string;
  city?: string;
  address?: string;
  facilities?: string[];
}
