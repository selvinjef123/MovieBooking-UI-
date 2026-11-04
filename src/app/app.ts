import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthResponse } from './models/auth';
import { BookingResponse } from './models/booking';
import { Movie } from './models/movie';
import { Show, ShowSeat } from './models/show';
import { AuthService } from './services/auth.service';
import { BookingService } from './services/booking.service';
import { MovieService } from './services/movie.service';
import { ShowService } from './services/show.service';

interface SeatRow {
  name: string;
  seats: ShowSeat[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe, FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly showService = inject(ShowService);
  private readonly bookingService = inject(BookingService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  movies: Movie[] = [];
  shows: Show[] = [];
  seats: ShowSeat[] = [];
  selectedSeats: ShowSeat[] = [];
  selectedMovieId: number | null = null;
  selectedMovieTitle = '';
  selectedShowId: number | null = null;
  booking: BookingResponse | null = null;

  isLoadingMovies = false;
  isLoadingShows = false;
  isLoadingSeats = false;
  isBooking = false;
  isAuthenticating = false;
  showAuthForm = false;
  authMode: 'login' | 'register' = 'login';
  movieSearch = '';

  movieError = '';
  showError = '';
  seatError = '';
  bookingError = '';
  authError = '';

  authForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
  };
  customerPhone = '';

  ngOnInit(): void {
    this.loadMovies();
  }

  get filteredMovies(): Movie[] {
    const search = this.movieSearch.trim().toLowerCase();
    if (!search) {
      return this.movies;
    }

    return this.movies.filter((movie) =>
      [movie.title, movie.genre, movie.language].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }

  get seatRows(): SeatRow[] {
    const rows = new Map<string, ShowSeat[]>();
    for (const seat of this.seats) {
      const row = rows.get(seat.rowName) ?? [];
      row.push(seat);
      rows.set(seat.rowName, row);
    }

    return [...rows.entries()]
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([name, rowSeats]) => ({
        name,
        seats: rowSeats.sort((first, second) => first.seatNumber - second.seatNumber),
      }));
  }

  get selectedShow(): Show | null {
    return this.shows.find((show) => show.showId === this.selectedShowId) ?? null;
  }

  get totalSeats(): number {
    return this.selectedSeats.length;
  }

  get totalAmount(): number {
    return this.selectedShow
      ? this.selectedShow.ticketPrice * this.totalSeats
      : this.selectedSeats.reduce((total, seat) => total + Number(seat.price), 0);
  }

  loadMovies(): void {
    this.isLoadingMovies = true;
    this.movieError = '';
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.isLoadingMovies = false;
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        this.movieError = this.errorMessage(error, 'Movies could not be loaded. Please try again.');
        this.isLoadingMovies = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  loadShows(movie: Movie): void {
    this.selectedMovieId = movie.movieId;
    this.selectedMovieTitle = movie.title;
    this.shows = [];
    this.showError = '';
    this.selectedShowId = null;
    this.seats = [];
    this.selectedSeats = [];
    this.booking = null;
    this.bookingError = '';
    this.isLoadingShows = true;

    this.showService.getShowsByMovie(movie.movieId).subscribe({
      next: (shows) => {
        this.shows = shows;
        this.isLoadingShows = false;
        this.changeDetector.markForCheck();
        this.scrollTo('shows');
      },
      error: (error: unknown) => {
        this.showError = this.errorMessage(error, 'Shows could not be loaded. Please try again.');
        this.isLoadingShows = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  reloadShows(): void {
    const movie = this.movies.find((item) => item.movieId === this.selectedMovieId);
    if (movie) {
      this.loadShows(movie);
    }
  }

  loadSeats(show: Show): void {
    this.selectedShowId = show.showId;
    this.seats = [];
    this.selectedSeats = [];
    this.seatError = '';
    this.bookingError = '';
    this.booking = null;
    this.isLoadingSeats = true;

    this.showService.getShowSeats(show.showId).subscribe({
      next: (seats) => {
        this.seats = seats;
        this.isLoadingSeats = false;
        this.changeDetector.markForCheck();
        this.scrollTo('seats');
      },
      error: (error: unknown) => {
        this.seatError = this.errorMessage(error, 'Seats could not be loaded. Please try again.');
        this.isLoadingSeats = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  isSeatAvailable(seat: ShowSeat): boolean {
    return seat.status.toLowerCase() === 'available';
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeats.some((seat) => seat.seatId === seatId);
  }

  toggleSeat(seat: ShowSeat): void {
    if (!this.isSeatAvailable(seat)) {
      return;
    }

    this.booking = null;
    this.bookingError = '';
    this.selectedSeats = this.isSeatSelected(seat.seatId)
      ? this.selectedSeats.filter((selected) => selected.seatId !== seat.seatId)
      : [...this.selectedSeats, seat];
  }

  clearSeatSelection(): void {
    this.selectedSeats = [];
    this.bookingError = '';
  }

  openAuth(mode: 'login' | 'register' = 'login'): void {
    this.authMode = mode;
    this.authError = '';
    this.showAuthForm = true;
  }

  submitAuth(): void {
    this.authError = '';
    this.isAuthenticating = true;
    const request =
      this.authMode === 'login'
        ? this.authService.login({
            email: this.authForm.email.trim(),
            password: this.authForm.password,
          })
        : this.authService.register({
            name: this.authForm.name.trim(),
            email: this.authForm.email.trim(),
            password: this.authForm.password,
            phone: this.authForm.phone.trim(),
          });

    request.subscribe({
      next: (session: AuthResponse) => {
        this.authForm.name = session.name;
        this.authForm.email = session.email;
        if (this.authMode === 'register') {
          this.customerPhone = this.authForm.phone;
        }
        this.showAuthForm = false;
        this.bookingError = '';
        this.isAuthenticating = false;
        this.changeDetector.markForCheck();
      },
      error: (error: unknown) => {
        this.authError = this.errorMessage(error, 'Unable to authenticate. Please try again.');
        this.isAuthenticating = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  signOut(): void {
    this.authService.logout();
    this.authForm = { name: '', email: '', password: '', phone: '' };
    this.customerPhone = '';
  }

  confirmBooking(): void {
    this.bookingError = '';
    if (!this.authService.session) {
      this.openAuth();
      this.bookingError = 'Sign in or create an account before confirming your booking.';
      return;
    }
    if (this.selectedShowId === null || this.selectedSeats.length === 0) {
      this.bookingError = 'Select at least one available seat.';
      return;
    }
    if (!this.customerPhone.trim()) {
      this.bookingError = 'Enter a contact phone number to continue.';
      return;
    }

    this.isBooking = true;
    this.bookingService
      .createBooking({
        customerName: this.authForm.name || this.authService.session.name,
        customerEmail: this.authForm.email || this.authService.session.email,
        customerPhone: this.customerPhone.trim(),
        showId: this.selectedShowId,
        seatIds: this.selectedSeats.map((seat) => seat.seatId),
      })
      .subscribe({
        next: (booking) => {
          this.booking = booking;
          this.selectedSeats = [];
          this.isBooking = false;
          this.isLoadingSeats = true;
          this.seatError = '';
          this.showService.getShowSeats(booking.showId).subscribe({
            next: (seats) => {
              this.seats = seats;
              this.isLoadingSeats = false;
              this.changeDetector.markForCheck();
            },
            error: (error: unknown) => {
              this.seatError = this.errorMessage(
                error,
                'Booking succeeded, but seats could not be refreshed.',
              );
              this.isLoadingSeats = false;
              this.changeDetector.markForCheck();
            },
          });
          this.scrollTo('booking-confirmation');
        },
        error: (error: unknown) => {
          this.bookingError = this.errorMessage(error, 'Booking failed. Please try again.');
          this.isBooking = false;
          this.changeDetector.markForCheck();
          if (error instanceof HttpErrorResponse && error.status === 409 && this.selectedShow) {
            const message = this.bookingError;
            this.loadSeats(this.selectedShow);
            this.bookingError = message;
          }
        },
      });
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (
      error instanceof HttpErrorResponse &&
      typeof error.error === 'object' &&
      error.error !== null
    ) {
      const body = error.error as Record<string, unknown>;
      for (const key of ['message', 'detail', 'title']) {
        if (typeof body[key] === 'string' && body[key]) {
          return body[key];
        }
      }
    }
    return fallback;
  }

  private scrollTo(sectionId: string): void {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
