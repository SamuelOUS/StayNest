import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// !Los modal de toda la página deben utilizar este servicio
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly _dialog = inject(MatDialog)
  constructor() { }
  // abre un modal con el componente de la referencia, 
  // y los datos opcionales que se pasan para desplegar en el modal 
  openModal<CT, T>(commponentRef: ComponentType<CT>, data?: T): void{
    const config = {data} 
    this._dialog.open(commponentRef, {
      data: config,
      width: '600px',
      minWidth: '300px',
    })
  }
}
