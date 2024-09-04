import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly _dialog = inject(MatDialog)
  constructor() { }
  openModal<CT, T>(commponentRef: ComponentType<CT>, data?: T,  isEditing = false): void{
    const config = {data, isEditing} 
    this._dialog.open(commponentRef, {
      data: config,
      width: '70%',
      height: '80%'
    })
  }

  closeModal(): void {
    this._dialog.closeAll();  
  }
}
