import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AvailabilityService, Slot, AvailabilityFilter } from './availability.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-availability',
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
  date: Date = new Date();

  slots: Slot[] = [];

  constructor(private availabilityService: AvailabilityService) {}

  search(): void {
    if (this.date && this.date.getDate() < this.minDate.getDate()) {
      alert('Por favor selecciona una fecha actual o futura.');
      return;
    }
    const filter: AvailabilityFilter = {
      city: this.selectedCity,
      venue: this.selectedVenue,
      date: this.date
    };
    this.availabilityService.getAvailability(filter).subscribe(slots => {
      this.slots = slots;
    });
  }
}
