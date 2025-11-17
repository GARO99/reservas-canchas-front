import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type BookingStatus = 'Confirmada' | 'Pendiente' | 'Cancelada';

export interface Booking {
  id: string;
  userId: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  field: string;
  status: BookingStatus;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings: Booking[] = [
    {
      id: 'b1',
      userId: 'u1',
      date: '2025-12-01',
      time: '18:00-19:00',
      city: 'Bogotá',
      venue: 'Sede Norte',
      field: 'Cancha 1',
      status: 'Confirmada'
    },
    {
      id: 'b2',
      userId: 'u1',
      date: '2025-12-05',
      time: '20:00-21:00',
      city: 'Bogotá',
      venue: 'Sede Sur',
      field: 'Cancha 3',
      status: 'Pendiente'
    }
  ];

  getBookings(userId?: string): Observable<Booking[]> {
    const data = userId
      ? this._bookings.filter(b => b.userId === userId)
      : this._bookings;
    return of([...data]).pipe(delay(300));
  }

  createBooking(params: {
    userId: string;
    date: string;
    time: string;
    city: string;   // 🆕
    venue: string;  // 🆕
    field: string;
  }): Observable<Booking> {
    const newBooking: Booking = {
      id: 'b' + Date.now().toString(),
      userId: params.userId,
      date: params.date,
      time: params.time,
      city: params.city,
      venue: params.venue,
      field: params.field,
      status: 'Confirmada'
    };
    this._bookings.push(newBooking);
    return of(newBooking).pipe(delay(300));
  }

  cancelBooking(id: string): Observable<Booking[]> {
    this._bookings = this._bookings.map(b =>
      b.id === id ? { ...b, status: 'Cancelada' } : b
    );
    return of([...this._bookings]).pipe(delay(300));
  }
}
