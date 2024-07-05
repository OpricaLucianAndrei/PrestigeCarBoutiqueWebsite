import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  showAlert(message: string): void {
    this.dialog.open(CustomAlertComponent, {
      data: { message },
      width: '300px'
    });
  }
}
