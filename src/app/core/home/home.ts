import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    { icon: 'schedule', title: 'Horarios flexibles', description: 'Consulta horarios disponibles fácilmente.' },
    { icon: 'sports_soccer', title: 'Varias sedes', description: 'Encuentra canchas en tu ciudad.' },
    { icon: 'notification_important', title: 'Notificaciones', description: 'Recibe confirmación y recordatorio.' }
  ];
}
