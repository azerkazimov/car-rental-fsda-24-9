import { sendBookingConfirmationNotification } from '@/services/push-service';
import { CarModel } from '@/types/car-model.types';
import uuid from 'react-native-uuid';
import { create } from "zustand";

export interface Booking {
  id: string;
  car: CarModel;
  rentalDays: number;
  totalPrice: number;
  serviceFee: number;
  finalTotal: number;
  bookingDate: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
}

interface BookingStore {
  selectedCar: CarModel | null;
  rentalDays: number;
  bookingHistory: Booking[];
  currentBooking: Booking | null;
  setSelectedCar: (car: CarModel | null) => void;
  setRentalDays: (days: number) => void;
  getTotalPrice: () => number;
  getServiceFee: () => number;
  getFinalTotal: () => number;
  confirmBooking: () => Promise<Booking | null>;
  addToHistory: (booking: Booking) => void;
  clearCurrentBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  selectedCar: null,
  rentalDays: 1,
  bookingHistory: [],
  currentBooking: null,
  
  setSelectedCar: (car) => set({ selectedCar: car }),
  setRentalDays: (days) => set({ rentalDays: days }),
  
  getTotalPrice: () => {
    const { selectedCar, rentalDays } = get();
    if (!selectedCar) return 0;
    return selectedCar.pricePerDay * rentalDays;
  },
  
  getServiceFee: () => {
    const totalPrice = get().getTotalPrice();
    return totalPrice * 0.05; // 5% service fee
  },
  
  getFinalTotal: () => {
    const totalPrice = get().getTotalPrice();
    const serviceFee = get().getServiceFee();
    return totalPrice + serviceFee;
  },
  
  confirmBooking: async () => {
    const { selectedCar, rentalDays, getTotalPrice, getServiceFee, getFinalTotal } = get();
    
    if (!selectedCar) {
      console.error('No car selected for booking');
      return null;
    }
    
    const booking: Booking = {
      id: uuid.v4() as string,
      car: selectedCar,
      rentalDays,
      totalPrice: getTotalPrice(),
      serviceFee: getServiceFee(),
      finalTotal: getFinalTotal(),
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    };

    // Persist booking first so confirmation isn't blocked by notification failures
    set((state) => ({
      bookingHistory: [booking, ...state.bookingHistory],
      currentBooking: booking,
    }));

    try {
      await sendBookingConfirmationNotification({
        carBrand: selectedCar.brand,
        carModel: selectedCar.model,
        rentalDays,
        totalPrice: booking.finalTotal,
        bookingId: booking.id,
      });
    } catch (error) {
      console.error('Error sending booking confirmation notification:', error);
    }

    console.log('Booking confirmed:', booking.id);
    return booking;
  },
  
  addToHistory: (booking) => {
    set((state) => ({
      bookingHistory: [booking, ...state.bookingHistory],
    }));
  },
  
  clearCurrentBooking: () => {
    set({
      selectedCar: null,
      rentalDays: 1,
      currentBooking: null,
    });
  },
}));

