import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { City, Field, InventoryService, Venue } from '../inventory.service';
import { Booking, BookingsService } from '../../bookings/bookings.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  // inventario
  cities: City[] = [];
  venues: Venue[] = [];
  fields: Field[] = [];

  selectedCityId = '';
  selectedVenueId = '';

  // reservas
  allBookings: Booking[] = [];
  bookingsDisplayedColumns: string[] = ['date', 'time', 'city', 'venue', 'field', 'userId', 'status'];

  newVenueName = '';
  newVenueAddress = '';

  newFieldName = '';
  newFieldType: Field['type'] | '' = '';
  newFieldIndoor = false;
  newFieldActive = true;
  newFieldPrice: number | null = null;

  constructor(
    private inventoryService: InventoryService,
    private bookingsService: BookingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadAllBookings();
  }

  private loadCities(): void {
    this.inventoryService.getCities().subscribe(cities => {
      this.cities = cities;
      if (cities.length) {
        this.selectedCityId = cities[0].id;
        this.onCityChange();
      }
    });
  }

  onCityChange(): void {
    if (!this.selectedCityId) {
      this.venues = [];
      this.fields = [];
      return;
    }
    this.inventoryService.getVenuesByCity(this.selectedCityId).subscribe(venues => {
      this.venues = venues;
      if (venues.length) {
        this.selectedVenueId = venues[0].id;
        this.onVenueChange();
      } else {
        this.selectedVenueId = '';
        this.fields = [];
      }
    });
  }

  onVenueChange(): void {
    if (!this.selectedVenueId) {
      this.fields = [];
      return;
    }
    this.inventoryService.getFieldsByVenue(this.selectedVenueId).subscribe(fields => {
      this.fields = fields;
    });
  }

  onToggleField(field: Field, checked: boolean): void {
    this.inventoryService.toggleFieldActive(field.id, checked).subscribe(updated => {
      this.snackBar.open(
        `Cancha "${updated.name}" ahora está ${updated.isActive ? 'activa' : 'inactiva'}.`,
        'Cerrar',
        { duration: 2500 }
      );
      this.onVenueChange();
    });
  }

  // helper para mostrar nombre de ciudad en el texto
  getCityName(cityId: string): string {
    return this.cities.find(c => c.id === cityId)?.name ?? '';
  }

  getVenueName(venueId: string): string {
    return this.venues.find(v => v.id === venueId)?.name ?? '';
  }

  createVenue(): void {
    if (!this.selectedCityId) {
      this.snackBar.open('Selecciona una ciudad antes de crear una sede.', 'Cerrar', { duration: 2500 });
      return;
    }
    if (!this.newVenueName.trim()) {
      this.snackBar.open('El nombre de la sede es obligatorio.', 'Cerrar', { duration: 2500 });
      return;
    }

    this.inventoryService.createVenue({
      cityId: this.selectedCityId,
      name: this.newVenueName.trim(),
      address: this.newVenueAddress.trim()
    }).subscribe(venue => {
      this.venues.push(venue);
      this.selectedVenueId = venue.id;
      this.onVenueChange();

      this.newVenueName = '';
      this.newVenueAddress = '';

      this.snackBar.open(
        `Sede "${venue.name}" creada en ${this.getCityName(venue.cityId)}.`,
        'Cerrar',
        { duration: 2500 }
      );
    });
  }

  // 🆕 Crear cancha
  createField(): void {
    if (!this.selectedVenueId) {
      this.snackBar.open('Selecciona una sede antes de crear una cancha.', 'Cerrar', { duration: 2500 });
      return;
    }
    if (!this.newFieldName.trim() || !this.newFieldType || this.newFieldPrice == null) {
      this.snackBar.open('Completa nombre, tipo y precio de la cancha.', 'Cerrar', { duration: 2500 });
      return;
    }

    this.inventoryService.createField({
      venueId: this.selectedVenueId,
      name: this.newFieldName.trim(),
      type: this.newFieldType as Field['type'],
      isIndoor: this.newFieldIndoor,
      isActive: this.newFieldActive,
      pricePerHour: this.newFieldPrice
    }).subscribe(field => {
      this.fields.push(field);

      this.newFieldName = '';
      this.newFieldType = '';
      this.newFieldIndoor = false;
      this.newFieldActive = true;
      this.newFieldPrice = null;

      this.snackBar.open(
        `Cancha "${field.name}" creada en la sede ${this.getVenueName(field.venueId)}.`,
        'Cerrar',
        { duration: 2500 }
      );
    });
  }

  private loadAllBookings(): void {
    this.bookingsService.getBookings().subscribe(all => {
      this.allBookings = all;
    });
  }
}
