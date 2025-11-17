import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AvailabilityService, Slot, AvailabilityFilter } from './availability.service';
import { BookingsService } from '../bookings/bookings.service';
import { AuthService, AuthUser } from '../auth/auth-service.service';
import { ConfirmBookingDialog } from './confirm-booking-dialog';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    LowerCasePipe,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './availability.html',
  styleUrl: './availability.scss',
})
export class Availability {
  minDate: Date = new Date();
  cities = ['Bogotá', 'Medellín', 'Cali'];
  venues = ['Sede Norte', 'Sede Sur', 'Campus A'];

  selectedCity = '';
  selectedVenue = '';
  date: Date | null = null;

  slots: Slot[] = [];
  currentUser: AuthUser | null = null;

  constructor(
    private availabilityService: AvailabilityService,
    private bookingsService: BookingsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => (this.currentUser = user));
  }

  search(): void {
  // 1) Validar que todos los campos del filtro estén completos
  if (!this.selectedCity || !this.selectedVenue || !this.date) {
    this.snackBar.open(
      'Por favor selecciona ciudad, sede y fecha antes de buscar.',
      'Cerrar',
      { duration: 3000 }
    );
    this.slots = [];
    return;
  }

  const selected = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    this.date.getDate()
  );
  const today = new Date(
    this.minDate.getFullYear(),
    this.minDate.getMonth(),
    this.minDate.getDate()
  );

  if (selected < today) {
    this.snackBar.open(
      'Por favor selecciona una fecha actual o futura.',
      'Cerrar',
      { duration: 3000 }
    );
    this.slots = [];
    return;
  }

  const filter: AvailabilityFilter = {
    city: this.selectedCity,
    venue: this.selectedVenue,
    date: this.date,
  };

  this.availabilityService.getAvailability(filter).subscribe(slots => {
    this.slots = slots;
  });
}

  onReserve(slot: Slot): void {
    if (!this.currentUser) {
      this.snackBar.open('Debes iniciar sesión para reservar.', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/availability' }
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmBookingDialog, {
      data: { slot },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.bookingsService.createBooking({
        userId: this.currentUser!.userId,
        date: slot.date,
        time: slot.time,
        city: this.selectedCity,
        venue: this.selectedVenue,
        field: slot.field
      }).subscribe(() => {
        this.snackBar.open('Reserva creada con éxito.', 'Cerrar', { duration: 3000 });
      });
    });
  }
}
