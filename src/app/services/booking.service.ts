import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingResponse, CreateBookingRequest } from '../models/booking';
import { API_BASE_URL } from './api';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);

  createBooking(request: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${API_BASE_URL}/Bookings`, request);
  }
}
