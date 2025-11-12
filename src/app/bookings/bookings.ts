import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface Booking {
  id: string;
  date: string;
  time: string;
  field: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  selector: 'app-bookings',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings {
bookings: Booking[] = [
    {
      id: 'b1',
      date: '2025-12-01',
      time: '18:00-19:00',
      field: 'Cancha 1',
      status: 'Confirmada'
    },
    {
      id: 'b2',
      date: '2025-12-05',
      time: '20:00-21:00',
      field: 'Cancha 3',
      status: 'Pendiente'
    },
    {
      id: 'b2',
      date: '2025-12-05',
      time: '20:00-21:00',
      field: 'Cancha 3',
      status: 'Cancelada'
    }
  ];

  displayedColumns: string[] = ['date', 'time', 'field', 'status', 'actions'];

  cancelBooking(bookingId: string): void {
    // por ahora lógica mock
    alert(`Cancelar reserva ${bookingId}`);
    // luego actualizamos estado en mock list o retiramos
  }
}
