
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MovieService } from './services/movie.service';
import { Movie } from './models/movie';

import { ShowService } from './services/show.service';
import { Show, ShowSeat } from './models/show';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Inject services
  private movieService = inject(MovieService);
  private showService = inject(ShowService);
  private cdr = inject(ChangeDetectorRef);

  // Movie properties
  movies: Movie[] = [];
  isLoading = false;
  errorMessage = '';

  // Show properties
  shows: Show[] = [];
  selectedMovieId: number | null = null;
  selectedMovieTitle = '';
  isLoadingShows = false;
  showError = '';

  // Seat properties
  selectedShowId: number | null = null;
  seats: ShowSeat[] = [];
  isLoadingSeats = false;
  seatError = '';

  // Load movies when component starts
  ngOnInit(): void {
    this.loadMovies();
  }

  // Get all movies
  loadMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies = data;
        this.isLoading = false;

        console.log('Movies loaded:', data);
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error loading movies:', error);

        this.errorMessage = 'Unable to load movies. Please try again.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Get shows for selected movie
  loadShows(movieId: number, movieTitle: string): void {

    this.selectedMovieId = movieId;
    this.selectedMovieTitle = movieTitle;

    this.shows = [];
    this.selectedShowId = null;
    this.seats = [];

    this.showError = '';
    this.seatError = '';

    this.isLoadingShows = true;

    this.showService.getShowsByMovie(movieId).subscribe({
      next: (data: Show[]) => {

        console.log('Shows loaded:', data);

        this.shows = data;
        this.isLoadingShows = false;

        this.cdr.detectChanges();
      },
      error: (error: unknown) => {

        console.error('Error loading shows:', error);

        this.showError = 'Unable to load shows.';
        this.isLoadingShows = false;

        this.cdr.detectChanges();
      }
    });
  }

  // Get seats for selected show
  loadSeats(showId: number): void {

    this.selectedShowId = showId;
    this.seats = [];
    this.seatError = '';

    this.isLoadingSeats = true;

    this.showService.getShowSeats(showId).subscribe({
      next: (data: ShowSeat[]) => {

        console.log('Seats loaded:', data);

        this.seats = data;
        this.isLoadingSeats = false;

        this.cdr.detectChanges();
      },
      error: (error: unknown) => {

        console.error('Error loading seats:', error);

        this.seatError = 'Unable to load seats.';
        this.isLoadingSeats = false;

        this.cdr.detectChanges();
      }
    });
  }
}
