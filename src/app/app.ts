import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MovieService } from './services/movie.service';
import { Movie } from './models/movie';

@Component({
  selector: 'app-root',
 imports: [RouterOutlet, DatePipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  private movieService = inject(MovieService);

  movies: Movie[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
        console.log('Movies loaded:', data);
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.errorMessage = 'Unable to load movies. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
