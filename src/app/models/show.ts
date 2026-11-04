
export interface Show {
  showId: number;
  movieId: number;
  movieTitle: string;

  screenId: number;
  screenName: string;

  theatreId: number;
  theatreName: string;

  startTime: string;
  endTime: string;

  ticketPrice: number;
}

export interface ShowSeat {
  seatId: number;
  rowName: string;
  seatNumber: number;
  seatLabel: string;
  seatType: string;
  price: number;
  status: string;
}
