import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Show, ShowSeat } from '../models/show';
import { API_BASE_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class ShowService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/Shows`;

  getShowsByMovie(movieId: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  getShowSeats(showId: number): Observable<ShowSeat[]> {
    return this.http.get<ShowSeat[]>(`${this.apiUrl}/${showId}/seats`);
  }

  getAvailableSeats(showId: number): Observable<ShowSeat[]> {
    return this.http.get<ShowSeat[]>(`${this.apiUrl}/${showId}/seats/available`);
  }
}
