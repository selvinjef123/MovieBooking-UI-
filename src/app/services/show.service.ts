import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Show, ShowSeat } from '../models/show';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5081/api/Shows';

  getShowsByMovie(movieId: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  getShowSeats(showId: number): Observable<ShowSeat[]> {
    return this.http.get<ShowSeat[]>(`${this.apiUrl}/${showId}/seats`);
  }

  getAvailableSeats(showId: number): Observable<ShowSeat[]> {
    return this.http.get<ShowSeat[]>(
      `${this.apiUrl}/${showId}/seats/available`
    );
  }
}