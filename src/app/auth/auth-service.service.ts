import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
}

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'app_auth_user';

  // usuario simulado para login
  private readonly _mockUser = {
    email: 'demo@example.com',
    password: 'password123',
    userId: 'u1',
    fullName: 'Usuario Demo',
    token: 'mock-token-abc-123'
  };

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  // Cargar usuario desde localStorage (si existe)
  private loadFromStorage(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AuthResponse;
      return {
        userId: parsed.userId,
        fullName: parsed.fullName,
        email: parsed.email
      };
    } catch {
      return null;
    }
  }

  private saveSession(resp: AuthResponse): void {
    const user: AuthUser = {
      userId: resp.userId,
      fullName: resp.fullName,
      email: resp.email
    };
    this.currentUserSubject.next(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(resp));
    }
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    const ok = req.email === this._mockUser.email && req.password === this._mockUser.password;

    if (!ok) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const resp: AuthResponse = {
      token: this._mockUser.token,
      userId: this._mockUser.userId,
      fullName: this._mockUser.fullName,
      email: this._mockUser.email
    };

    this.saveSession(resp);

    // simulamos latencia
    return of(resp).pipe(delay(500));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    const resp: AuthResponse = {
      token: 'mock-token-' + Math.random().toString(36).substring(2, 10),
      userId: 'u' + Math.floor(Math.random() * 10000),
      fullName: req.fullName,
      email: req.email
    };

    // Para simplificar, tras registrarse queda logueado
    this.saveSession(resp);

    return of(resp).pipe(delay(500));
  }

  logout(): void {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
