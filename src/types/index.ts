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
  profilePicture?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  genres: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  runtime: number;
  rating: number;
  status: MovieStatus;
  language: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  productionCompanies: string[];
  cast?: {
    id: number;
    name: string;
    character: string;
    profileUrl: string;
  }[];
  director: string;
  trailer?: {
    key: string;
    site: string;
  } | null;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  address: string;
  facilities: string[];
  capacity: number;
  showTimes?: string[];
  regularPriceWeekday: number;
  regularPriceWeekend: number;
  vipPriceWeekday: number;
  vipPriceWeekend: number;
  bookings?: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface ShowTime {
  id: string;
  movieId: number;
  theaterId: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
}

export interface Booking {
  id: string;
  userId: string;
  theaterId: string;
  tmdbMovieId: number;
  posterUrl: string;
  showDate: string;
  showTime: string;
  isVIP: boolean;
  seats: string[];
  totalPrice: number;
  status: BookingStatus;
  theater: Theater;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto {
  title: string;
  description: string;
  genres: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  runtime: number;
  status: MovieStatus;
}

export interface UpdateMovieDto extends Partial<CreateMovieDto> {}

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
