import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Booking {
  id: string;
  date: string;
  time: string;
  field: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  // Datos mock iniciales
  private _bookings: Booking[] = [
    { id: 'b1', date: '2025-12-01', time: '18:00-19:00', field: 'Cancha 1', status: 'Confirmada' },
    { id: 'b2', date: '2025-12-05', time: '20:00-21:00', field: 'Cancha 3', status: 'Pendiente' }
  ];

  constructor() { }

  /** Obtiene todas las reservas del usuario (simulado) */
  getBookings(): Observable<Booking[]> {
    // Retorna una copia para evitar mutaciones externas
    return of(this._bookings.map(b => ({ ...b }))).pipe(
      delay(300) // simula latencia
    );
  }

  /** Cancela una reserva por id (simulado) */
  cancelBooking(id: string): Observable<Booking[]> {
    // Cambia el estado a ‘Cancelada’
    this._bookings = this._bookings.map(b =>
      b.id === id ? { ...b, status: 'Cancelada' } : b
    );
    // Retorna la lista actualizada
    return of(this._bookings.map(b => ({ ...b }))).pipe(
      delay(300)
    );
  }
}
