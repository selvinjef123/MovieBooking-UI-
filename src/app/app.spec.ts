import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth.service';
import { BookingService } from './services/booking.service';
import { MovieService } from './services/movie.service';
import { ShowService } from './services/show.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: MovieService, useValue: { getMovies: () => of([]) } },
        {
          provide: ShowService,
          useValue: {
            getShowsByMovie: () => of([]),
            getShowSeats: () => of([]),
          },
        },
        { provide: BookingService, useValue: { createBooking: () => of({}) } },
        { provide: AuthService, useValue: { session: null, logout: () => {} } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the CineBook hero heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Big stories.');
  });
});
