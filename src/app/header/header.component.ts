import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../modal.service';
import { RegisterComponent } from '../register/register.component';
import { LogInComponent } from '../log-in/log-in.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterComponent, MatMenuModule, MatButtonModule],
  template: `
    <header>
        <div class="container">
            <img class="logo" src="logo.png">
            <div class="search-bar">
                <input type="text" placeholder="Dónde" class="input-where">
                <input type="date" placeholder="Llegada" class="input-date">
                <input type="date" placeholder="Salida" class="input-date">
                <input type="number" placeholder="¿Cuántas personas?" class="input-people">
                <button class="search-button"></button>
            </div>
            <div class="right-menu">
                <button mat-button [matMenuTriggerFor]="menu" class="menu-btn">
                  <img src="/menu.png" alt="">
                </button>
                <mat-menu #menu="matMenu">
                  @if (isLoggedIn) {
                    <a mat-menu-item>Mi Perfil</a>
                    <a mat-menu-item href="#" id="btnBookings">Mis Reservas</a>
                    <a mat-menu-item href="#" id="btnMessages">Mensajes</a>
                    <a mat-menu-item href="#" id="btnLogout">Cerrar Sesión</a>
                  }@else {
                    <a mat-menu-item (click)="openRegister()">Registrarse</a>
                    <a mat-menu-item (click)="openLogIn()">Iniciar Sesión</a>
                  }
                  <hr>
                  <a mat-menu-item href="help_center.html">Centro de Ayuda</a>
                </mat-menu>
                <img class="user-icon" src="user.png" alt="User">
            </div>
        </div>
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false; 

  // Servicio para acceder a cada modal con un buen patron
  private readonly _modalSvc = inject(ModalService);

  //Funciones para abrir los modales
  openRegister = (): void => {
    this._modalSvc.openModal<RegisterComponent, null>(RegisterComponent);
  }

  public openLogIn = ():void => {
    this._modalSvc.openModal<LogInComponent, null>(LogInComponent);
  }

}
