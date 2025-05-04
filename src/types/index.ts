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
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  facilities: string[];
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowTime {
  id: string;
  tmdbMovieId: number;
  theaterId: string;
  startTime: string;
  price: number;
  theater: Theater;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalPrice: number;
  status: BookingStatus;
  showTime: ShowTime;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto
  extends Omit<Movie, "id" | "createdAt" | "updatedAt"> {}
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
