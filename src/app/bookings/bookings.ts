import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BookingsService, Booking } from './bookings.service';

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
  bookings: Booking[] = [];
  displayedColumns: string[] = ['date', 'time', 'field', 'status', 'actions'];

  constructor(private bookingsService: BookingsService) {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingsService.getBookings().subscribe(bs => {
      this.bookings = bs;
    });
  }

  cancelBooking(bookingId: string): void {
    this.bookingsService.cancelBooking(bookingId).subscribe(bs => {
      this.bookings = bs;
    });
  }
}
