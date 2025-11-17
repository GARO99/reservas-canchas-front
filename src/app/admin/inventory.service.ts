import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface City {
  id: string;
  name: string;
}

export interface Venue {
  id: string;
  cityId: string;
  name: string;
  address: string;
}

export interface Field {
  id: string;
  venueId: string;
  name: string;
  type: 'Fútbol 5' | 'Fútbol 7' | 'Fútbol 11';
  isIndoor: boolean;
  isActive: boolean;
  pricePerHour: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private _cities: City[] = [
    { id: 'c1', name: 'Bogotá' },
    { id: 'c2', name: 'Medellín' },
    { id: 'c3', name: 'Cali' }
  ];

  private _venues: Venue[] = [
    { id: 'v1', cityId: 'c1', name: 'Sede Norte', address: 'Calle 123 #45-67' },
    { id: 'v2', cityId: 'c1', name: 'Sede Sur', address: 'Cra 10 #20-30' },
    { id: 'v3', cityId: 'c2', name: 'Campus A', address: 'Av. Principal 50' }
  ];

  private _fields: Field[] = [
    { id: 'f1', venueId: 'v1', name: 'Cancha 1', type: 'Fútbol 5',  isIndoor: false, isActive: true,  pricePerHour: 80000 },
    { id: 'f2', venueId: 'v1', name: 'Cancha 2', type: 'Fútbol 7',  isIndoor: true,  isActive: true,  pricePerHour: 120000 },
    { id: 'f3', venueId: 'v2', name: 'Cancha 3', type: 'Fútbol 11', isIndoor: false, isActive: false, pricePerHour: 150000 },
    { id: 'f4', venueId: 'v3', name: 'Cancha 4', type: 'Fútbol 5',  isIndoor: true,  isActive: true,  pricePerHour: 90000 }
  ];

  getCities(): Observable<City[]> {
    return of([...this._cities]).pipe(delay(200));
  }

  getVenuesByCity(cityId: string): Observable<Venue[]> {
    const venues = this._venues.filter(v => v.cityId === cityId);
    return of([...venues]).pipe(delay(200));
  }

  getFieldsByVenue(venueId: string): Observable<Field[]> {
    const fields = this._fields.filter(f => f.venueId === venueId);
    return of([...fields]).pipe(delay(200));
  }

  toggleFieldActive(fieldId: string, isActive: boolean): Observable<Field> {
    const idx = this._fields.findIndex(f => f.id === fieldId);
    if (idx >= 0) {
      this._fields[idx] = { ...this._fields[idx], isActive };
      return of({ ...this._fields[idx] }).pipe(delay(200));
    }
    return of(this._fields[0]).pipe(delay(200));
  }

  createVenue(payload: { cityId: string; name: string; address: string }): Observable<Venue> {
    const id = 'v' + (Date.now().toString());
    const venue: Venue = {
      id,
      cityId: payload.cityId,
      name: payload.name,
      address: payload.address
    };
    this._venues.push(venue);
    return of({ ...venue }).pipe(delay(200));
  }

  createField(payload: {
    venueId: string;
    name: string;
    type: Field['type'];
    isIndoor: boolean;
    isActive: boolean;
    pricePerHour: number;
  }): Observable<Field> {
    const id = 'f' + (Date.now().toString());
    const field: Field = {
      id,
      venueId: payload.venueId,
      name: payload.name,
      type: payload.type,
      isIndoor: payload.isIndoor,
      isActive: payload.isActive,
      pricePerHour: payload.pricePerHour
    };
    this._fields.push(field);
    return of({ ...field }).pipe(delay(200));
  }
}
