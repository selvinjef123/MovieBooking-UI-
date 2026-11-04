import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth';
import { API_BASE_URL } from './api';

const SESSION_KEY = 'movie-booking-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private currentSession: AuthResponse | null = this.restoreSession();

  get session(): AuthResponse | null {
    return this.currentSession;
  }

  get token(): string | null {
    return this.currentSession?.token ?? null;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/Auth/login`, request)
      .pipe(tap((session) => this.saveSession(session)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/Auth/register`, request)
      .pipe(tap((session) => this.saveSession(session)));
  }

  logout(): void {
    this.currentSession = null;
    if (this.isBrowser) {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private saveSession(session: AuthResponse): void {
    this.currentSession = session;
    if (this.isBrowser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }

  private restoreSession(): AuthResponse | null {
    if (!this.isBrowser) {
      return null;
    }

    const storedSession = localStorage.getItem(SESSION_KEY);
    if (!storedSession) {
      return null;
    }

    try {
      const session: unknown = JSON.parse(storedSession);
      if (
        typeof session === 'object' &&
        session !== null &&
        'userId' in session &&
        typeof session.userId === 'number' &&
        'token' in session &&
        typeof session.token === 'string' &&
        'name' in session &&
        typeof session.name === 'string' &&
        'email' in session &&
        typeof session.email === 'string' &&
        'role' in session &&
        typeof session.role === 'string'
      ) {
        return session as AuthResponse;
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }

    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}
