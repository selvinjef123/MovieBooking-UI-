export interface CreateBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  showId: number;
  seatIds: number[];
}

export interface BookingResponse {
  bookingId: number;
  bookingReference: string;
  showId: number;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  showStartTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  totalAmount: number;
  status: string;
  seats: string[];
}
