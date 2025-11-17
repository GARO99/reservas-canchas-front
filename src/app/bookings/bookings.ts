import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BookingsService, Booking } from './bookings.service';
import { AuthService, AuthUser } from '../auth/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  currentUser: AuthUser | null = null;

  constructor(
    private bookingsService: BookingsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadBookings();
      } else {
        this.bookings = [];
      }
    });
  }

  loadBookings(): void {
    if (!this.currentUser) return;

    this.bookingsService
      .getBookings(this.currentUser.userId)
      .subscribe(list => (this.bookings = list));
  }

  cancelBooking(bookingId: string): void {
     this.bookingsService.cancelBooking(bookingId).subscribe(() => {
      this.snackBar.open('Reserva cancelada.', 'Cerrar', { duration: 3000 });
      this.loadBookings();
    });
  }
}
