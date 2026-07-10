import { create } from "zustand";

interface BookingState {
    bookingStartDate: string | null;
    bookingEndDate: string | null;
    bookingDays: number | null;
    setBookingStartDate: (date: string | null) => void;
    setBookingEndDate: (date: string | null) => void;
    setBookingDays: (days: number | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    bookingStartDate: "",
    bookingEndDate: "",
    bookingDays: 0,
    setBookingStartDate: (date: string | null) => set({ bookingStartDate: date }),
    setBookingEndDate: (date: string | null) => set({ bookingEndDate: date }),
    setBookingDays: (days: number | null) => set({ bookingDays: days }),
}))