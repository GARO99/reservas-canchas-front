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

export type UserRole = 'user' | 'admin';

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthUser {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'app_auth_user';

  // Usuarios simulados para login
  private readonly _mockUsers = [
    {
      email: 'demo@example.com',
      password: 'password123',
      userId: 'u1',
      fullName: 'Usuario Demo',
      token: 'mock-token-user-123',
      role: 'user' as UserRole
    },
    {
      email: 'admin@example.com',
      password: 'password123',
      userId: 'admin1',
      fullName: 'Admin Demo',
      token: 'mock-token-admin-456',
      role: 'admin' as UserRole
    }
  ];

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  // Cargar usuario desde localStorage (si existe)
  private loadFromStorage(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partial<AuthResponse>;
      if (!parsed.userId || !parsed.fullName || !parsed.email) {
        return null;
      }
      const role: UserRole = (parsed.role as UserRole) ?? 'user';
      return {
        userId: parsed.userId,
        fullName: parsed.fullName,
        email: parsed.email,
        role
      };
    } catch {
      return null;
    }
  }

  private saveSession(resp: AuthResponse): void {
    const user: AuthUser = {
      userId: resp.userId,
      fullName: resp.fullName,
      email: resp.email,
      role: resp.role
    };
    this.currentUserSubject.next(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(resp));
    }
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    const found = this._mockUsers.find(
      u => u.email === req.email && u.password === req.password
    );

    if (!found) {
      return throwError(() => new Error('Credenciales incorrectas'));
    }

    const resp: AuthResponse = {
      token: found.token,
      userId: found.userId,
      fullName: found.fullName,
      email: found.email,
      role: found.role
    };

    this.saveSession(resp);

    // simulamos latencia
    return of(resp).pipe(delay(500));
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    // Regla simple: si el email empieza por "admin", es admin; si no, user
    const role: UserRole = req.email.toLowerCase().startsWith('admin') ? 'admin' : 'user';

    const resp: AuthResponse = {
      token: 'mock-token-' + Math.random().toString(36).substring(2, 10),
      userId: 'u' + Math.floor(Math.random() * 10000),
      fullName: req.fullName,
      email: req.email,
      role
    };

    // Tras registrarse queda logueado
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

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }
}
