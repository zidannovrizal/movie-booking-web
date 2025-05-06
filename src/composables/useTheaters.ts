import { ref, computed } from "vue";
import { movieApi } from "@/api/movies";
import moment from "moment";
import type { Theater as ApiTheater } from "@/types";

interface ApiTheaterResponse extends ApiTheater {
  bookings?: Record<string, string[]>;
}

export interface Theater extends ApiTheater {
  bookings: Record<string, string[]>;
  regularPriceWeekday: number;
  regularPriceWeekend: number;
  vipPriceWeekday: number;
  vipPriceWeekend: number;
  showTimes: string[];
}

export function useTheaters(movieId: string) {
  const theaters = ref<Theater[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const selectedTheater = ref<string | null>(null);
  const selectedDate = ref(moment().format("YYYY-MM-DD"));
  const selectedTime = ref<string | null>(null);
  const isVIP = ref(false);

  // Load theaters and their availability
  const loadTheaters = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await movieApi.getMovieTheaters(Number(movieId));
      theaters.value = (response.theaters as ApiTheaterResponse[]).map(
        (theater) => ({
          ...theater,
          regularPriceWeekday: 100000, // Default prices in IDR
          regularPriceWeekend: 120000,
          vipPriceWeekday: 150000,
          vipPriceWeekend: 180000,
          showTimes: ["11:00", "14:00", "17:00", "20:00"], // Default show times
          bookings: theater.bookings || {},
        })
      );
    } catch (err: any) {
      error.value = err.message;
      console.error("Error loading theaters:", err);
    } finally {
      loading.value = false;
    }
  };

  // Get available dates (next 7 days)
  const availableDates = computed(() => {
    const dates = [];
    const today = moment();

    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, "days");
      dates.push({
        value: date.format("YYYY-MM-DD"),
        label: date.format("ddd, MMM D"),
        day: date.format("ddd"),
        date: date.format("D"),
        month: date.format("MMM"),
        isToday: date.isSame(today, "day"),
      });
    }
    return dates;
  });

  // Get available times for selected theater
  const availableTimes = computed(() => {
    if (!selectedTheater.value) return [];

    const theater = theaters.value.find((t) => t.id === selectedTheater.value);
    if (!theater) return [];

    const now = moment();
    const selectedMoment = moment(selectedDate.value);
    const isToday = selectedMoment.isSame(now, "day");

    return theater.showTimes.map((time) => {
      const timeObj = moment(time, "HH:mm");
      const dateTime = moment(selectedDate.value).set({
        hour: timeObj.get("hour"),
        minute: timeObj.get("minute"),
      });

      const isPast = isToday && dateTime.isBefore(now);
      const key = `${selectedDate.value}_${time}`;
      const bookedSeats = theater.bookings[key] || [];

      return {
        value: time,
        label: moment(time, "HH:mm").format("h:mm A"),
        isPast,
        isAvailable: bookedSeats.length < theater.capacity,
      };
    });
  });

  // Calculate price based on selected options
  const calculatePrice = computed(() => {
    if (!selectedTheater.value) return 0;

    const theater = theaters.value.find((t) => t.id === selectedTheater.value);
    if (!theater) return 0;

    // For now, return a fixed price since the theater model has changed
    // TODO: Implement dynamic pricing based on the new theater model
    return isVIP.value ? 150000 : 100000; // Default prices in IDR
  });

  // Check if booking is possible
  const canBook = computed(() => {
    return selectedTheater.value && selectedDate.value && selectedTime.value;
  });

  return {
    theaters,
    loading,
    error,
    selectedTheater,
    selectedDate,
    selectedTime,
    isVIP,
    availableDates,
    availableTimes,
    calculatePrice,
    canBook,
    loadTheaters,
  };
}
