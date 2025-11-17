import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Slot {
  field: string;
  date: string;
  time: string;
  status: 'Libre' | 'Ocupado';
}

export interface AvailabilityFilter {
  city: string;
  venue: string;
  date: Date | null;
}

type BaseSlot = Omit<Slot, 'date'>;

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  private _slotsDatabase: BaseSlot[] = [
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' },
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' },
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' },
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' },
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' },
    { field: 'Cancha 1', time: '18:00-19:00', status: 'Libre' },
    { field: 'Cancha 2', time: '19:00-20:00', status: 'Ocupado' },
    { field: 'Cancha 3', time: '20:00-21:00', status: 'Libre' }
  ];

  constructor() { }

  /**
   * Simula una llamada al backend para obtener disponibilidad.
   * Retorna un Observable que emite los slots filtrados después de un delay simulado.
   */
  getAvailability(filter: AvailabilityFilter): Observable<Slot[]> {
    const dateStr = filter.date ? filter.date.toISOString().slice(0, 10) : '';

    // Filtrado mock (por ahora no usamos city/venue, pero aquí quedaría el filtro real)
    const filtered = this._slotsDatabase.filter(s =>
      (filter.city ? true : true) &&
      (filter.venue ? true : true)
    );

    return of(filtered).pipe(
      delay(500), // simula latencia
      map(slots =>
        slots.map<Slot>(s => ({
          ...s,
          date: dateStr || 'Sin fecha'
        }))
      )
    );
  }

}
