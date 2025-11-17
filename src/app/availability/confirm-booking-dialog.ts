import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Slot } from './availability.service';

export interface ConfirmBookingData {
  slot: Slot;
}

@Component({
  selector: 'app-confirm-booking-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar reserva</h2>
    <div mat-dialog-content>
      <p><strong>Cancha:</strong> {{ data.slot.field }}</p>
      <p><strong>Fecha:</strong> {{ data.slot.date }}</p>
      <p><strong>Hora:</strong> {{ data.slot.time }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onConfirm()">Confirmar</button>
    </div>
  `
})
export class ConfirmBookingDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmBookingData,
    private dialogRef: MatDialogRef<ConfirmBookingDialog>
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
