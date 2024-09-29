import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from '../../../auth/components/register/register.component';
import { LogInComponent } from '../../../auth/components/log-in/log-in.component';
import { UserService } from '../../../auth/services/user.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RegisterComponent, MatMenuModule, MatButtonModule, RouterLink],
  template: `
    <header>
        <div class="container">
            <img [routerLink]="['/home']" class="logo" src="logo.png">
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
                  @if (user().username) {
                    <a mat-menu-item [routerLink]="['/profile']">Mi Perfil</a>
                    @if(user().owner){
                      <a mat-menu-item [routerLink]="['/my_properties']">Mis propiedades</a>
                    }
                    <a mat-menu-item >Mis Reservas</a>
                    <a mat-menu-item >Mensajes</a>
                    <a mat-menu-item (click)="logout()">Cerrar Sesión</a>
                  }@else {
                    <a mat-menu-item (click)="openRegister()">Registrarse</a>
                    <a mat-menu-item (click)="openLogIn()">Iniciar Sesión</a>
                  }
                  <hr>
                  <a mat-menu-item [routerLink]="['/help_center']">Centro de Ayuda</a>
                </mat-menu>
                @if(user().username){
                  <img class="user-icon" [src]="user().photo || 'user.png'" alt="User">
                }
            </div>
        </div>
    </header>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  //Inyección de servicios
  private readonly userService = inject(UserService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  user;
  constructor(){
    this.user = this.userService.getUser()
  }

  logout(){
    this.userService.logout();
    this.user = this.userService.getUser();
    this.router.navigateByUrl('');
    Swal.fire({
      text: 'Sesión cerrada',
      icon: 'success',
    })
  }

  
  //Funciones para abrir los modales
  openRegister = (): void => {
    this.modalService.openModal<RegisterComponent, null>(RegisterComponent);
  }

  public openLogIn = ():void => {
    this.modalService.openModal<LogInComponent, null>(LogInComponent);
  }

}
