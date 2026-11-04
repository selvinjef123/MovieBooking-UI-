import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { Movie } from '../models/movie';
import { API_BASE_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${API_BASE_URL}/Movies`;
  private readonly pageSize = 100;

  getMovies(): Observable<Movie[]> {
    return this.getMoviePage(1).pipe(
      expand((page, index) =>
        page.length === this.pageSize ? this.getMoviePage(index + 2) : EMPTY,
      ),
      reduce((movies, page) => [...movies, ...page], [] as Movie[]),
    );
  }

  private getMoviePage(pageNumber: number): Observable<Movie[]> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', this.pageSize);
    return this.http.get<Movie[]>(this.apiUrl, { params });
  }
}
